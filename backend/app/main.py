# -*- coding: utf-8 -*-
"""
Created on Mon Sep 16 14:32:01 2024

@author: 8778t
"""

from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import InvalidTokenError
from typing import Annotated, List
from fastapi import Depends, FastAPI, Body, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import dotenv_values
from pymongo import MongoClient
from pydantic import BaseModel

from models.diary_entry import DiaryEntry, DiaryEntryUpdate
from models.user import User, UserUpdate

from services.predict_service import predict_service
from services.diary_entry_service import DiaryEntryService
from services.user_service import UserService
from services.auth_service import AuthService
from services.vectordb_service import VectoredService

class Token(BaseModel):
    access_token: str
    token_type: str

config = dotenv_values(".env")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Up
    atlas_uri = config["ATLAS_URI"]
    if not atlas_uri:
        raise ValueError("No atlas uri is provided")
    db_name = config["DB_NAME"]
    if not db_name:
        raise ValueError("No db name is provided")
    app.mongodb_client = MongoClient(atlas_uri)
    app.database = app.mongodb_client[db_name]
    print("Connected to the MongoDB database!")
    app.diary_entry_service = DiaryEntryService(app.database["diary_entries"])
    app.user_service = UserService(app.database["users"])
    app.auth_service = AuthService(app.user_service, config["SECRET_KEY"], config["ALGORITHM"])
    yield
    # Shutdown
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config["SECRET_KEY"], algorithms=[config["ALGORITHM"]])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = app.auth_service.TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = app.user_service.find_user_by_username(username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user["disabled"]:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.get("/")
async def root():
    return {"message": "Diary app is running"}

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}

'''
Endpoint to get access token.
Expects:
in Body, form-data object, in this format:
{
  "username": "",
  "password": ""
}

Returns:
{
  "access_token": "",
  "token_type": ""
}
'''
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    print(form_data)
    user = app.auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(config["ACCESS_TOKEN_EXPIRE_MINUTES"]))
    access_token = app.auth_service.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

'''
Endpoint to get the current user info using the access_token
Expects:
in Header:
{
  Authorization: "Bearer <access_token>"
}

Returns:
user info like this:
{
  "_id": "",
  "username": "",
  "hashed_password": "",
  "email": "",
  "full_name": "",
  "role": "",
  "disabled": null,
  "created": "",
  "updated": ""
}
'''
@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user

@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user["username"]}]

# Diary Entry Endpoint
@app.post("/diary_entry", response_description="Create a new diary entry", status_code=status.HTTP_201_CREATED, response_model=DiaryEntry)
def create_diary_entry(diaryEntry: DiaryEntry = Body(...)):
    diaryEntry = jsonable_encoder(diaryEntry)
    # predicted_class_number, predicted_class, confidence, confidence_scores = predict_service.predict(diaryEntry["content"])
    # diaryEntry["prediction"] = predicted_class
    diaryEntry = app.diary_entry_service.create_diary_entry(diaryEntry)
    return diaryEntry

@app.get("/diary_entry", response_description="List all diary entries", response_model=List[DiaryEntry])
def list_diary_entries():
    return app.diary_entry_service.list_diary_entries()

@app.get("/diary_entry/{id}", response_description="Get a single diary entry by id", response_model=DiaryEntry)
def find_diary_entry(id: str):
    if (diaryEntry := app.diary_entry_service.find_diary_entry(id)) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Diary Entry with ID {id} not found")
    return diaryEntry

@app.put("/diary_entry/{id}", response_description="Update a diary entry", response_model=DiaryEntry)
async def update_diary_entry(id: str, diaryEntry: DiaryEntryUpdate = Body(...)):
    try:
        diaryEntry = jsonable_encoder(diaryEntry)
        predicted_class_number, predicted_class, confidence, confidence_scores = predict_service.predict(diaryEntry["content"])
        diaryEntry["predicted_class_number"] = predicted_class_number
        diaryEntry["prediction_class"] = predicted_class
        diaryEntry["confidence"] = confidence
        diaryEntry["confidence_scores"] = confidence_scores

        vectored_service = VectoredService()

        diary_content = diaryEntry["content"]

        advice = await vectored_service.generate_advice(predicted_class, diary_content)
        diaryEntry["advice"] = advice

        updated_diary_entry = app.diary_entry_service.update_diary_entry(id, diaryEntry)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.args[0])
    return updated_diary_entry

@app.delete("/diary_entry/{id}", response_description="Delete a diary entry")
def delete_diary_entry(id: str, response: Response):
    try:
        app.diary_entry_service.delete_diary_entry(id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.args[0])
    response.status_code = status.HTTP_204_NO_CONTENT
    return response

@app.get("/diary_streak", response_description="Get current diary entry streak")
def get_streak():
    diary_entries = list_diary_entries()

    # Mock data
    # diary_entries = [
    #   {
    #     "created": "2024-11-02T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-11-01T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-11-01T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-28T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-27T07:52:32.917025",
    #   }
    # ]
    
    # Collect "created" dates, remove duplicates using set, and sort
    dates = list(sorted({datetime.fromisoformat(entry["created"]).date() for entry in diary_entries}, reverse=True))

    current_streak = 1
    today = datetime.now().date()

    # Check if the most recent entry is today or yesterday; otherwise, streak is zero
    if dates[0] < today - timedelta(days=1):
        return {
            "streak": 0,
        }
    
    # Iterate from the most recent to the oldest date
    for i in range(1, len(dates)):
        if dates[i] == dates[i - 1] - timedelta(days=1):
            current_streak += 1
        else:
            break  # Stop if there is a gap in the streak

    return {
        "streak": current_streak,
    }

@app.get("/max_diary_streak", response_description="Get longest diary entry streak")
def get_streak():
    diary_entries = list_diary_entries()

    # Mock data
    # diary_entries = [
    #   {
    #     "created": "2024-11-01T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-31T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-30T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-28T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-27T07:52:32.917025",
    #   }
    # ]
    
    # Collect "created" dates, remove duplicates using set, and sort
    dates = list(sorted({datetime.fromisoformat(entry["created"]).date() for entry in diary_entries}, reverse=True))

    max_streak = 1
    current_streak = 1
    
    # Iterate from the most recent to the oldest date
    for i in range(1, len(dates)):
        if dates[i] == dates[i - 1] - timedelta(days=1):
            current_streak += 1
        else:
            # Update max_streak if the current one is the longest found so far
            max_streak = max(max_streak, current_streak)
            current_streak = 1  # Reset the current streak

    max_streak = max(max_streak, current_streak)

    return {
        "max_streak": max_streak,
    }

@app.get("/diary_dates", response_description="Get longest diary entry streak")
def get_diary_dates():
    diary_entries = list_diary_entries()

    # Mock data
    # diary_entries = [
    #   {
    #     "created": "2024-11-01T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-31T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-30T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-28T07:52:32.917025",
    #   },
    #   {
    #     "created": "2024-10-27T07:52:32.917025",
    #   }
    # ]
    
    # Collect "created" dates, remove duplicates using set, and sort
    dates = {datetime.fromisoformat(entry["created"]).date() for entry in diary_entries}

    return {
        "dates": dates,
    }

# User Endpoint
'''
Endpoint to create user.
Needed body:
{
    "username": "",
    "password": "",
    "email": "",
    "full_name": "",
    "role": ""
}
'''
@app.post("/user", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
def create_user(user: User = Body(...)):
    user = jsonable_encoder(user)
    user["hashed_password"] = app.auth_service.get_password_hash(user["hashed_password"])
    created_user = app.user_service.create_user(user)
    return created_user

@app.get("/user", response_description="List all users", response_model=List[User])
def list_users():
    return app.user_service.list_users()

@app.get("/user/{id}", response_description="Get a single user by id", response_model=User)
def find_user(id: str):
    if (user := app.user_service.find_user(id)) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")
    return user

@app.put("/user/{id}", response_description="Update a user", response_model=User)
def update_user(id: str, user: UserUpdate = Body(...)):
    try:
        user = jsonable_encoder(user)
        user["hashed_password"] = app.auth_service.get_password_hash(user["password"])
        del user["password"]
        updated_user = app.user_service.update_user(id, user)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.args[0])
    return updated_user

@app.delete("/user/{id}", response_description="Delete a user")
def delete_user(id: str, response: Response):
    try:
        app.user_service.delete_user(id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.args[0])
    response.status_code = status.HTTP_204_NO_CONTENT
    return response