import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class User(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, alias="_id")
    username: str = Field(...)
    password: str = Field(..., alias="hashed_password")
    email: str = Field(...)
    full_name: str = Field(...)
    role: str = Field(...)
    disabled: bool | None = None
    created: datetime = Field(default_factory=datetime.now)
    updated: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "username": "pak",
                "password": "secret",
                "email": "pwon1@my.centennialcollege.ca",
                "full_name": "Pak",
                "role": "user",
                "disabled": "false",
            }
        }

class UserUpdate(BaseModel):
    username: Optional[str]
    password: Optional[str] = None
    email: Optional[str]
    full_name: Optional[str]
    disabled: Optional[bool]
    created: datetime = Field(default_factory=datetime.now)
    updated: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "username": "pwon1",
                "password": "secret",
                "email": "pwon1@my.centennialcollege.ca",
                "full_name": "Pak",
                "disabled": "false",
                "updated": "2032-04-23T10:20:30.400+02:30"
            }
        }

class UserSummary(BaseModel):
    anxiety_count: Optional[int]
    bipolar_count: Optional[int]
    depression_count: Optional[int]
    other_count: Optional[int]
    suicide_count: Optional[int]
    user_id: Optional[str]
    username: Optional[str]

class UserPwdReset(BaseModel):
    password: Optional[str]
    updated: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "password": "secret"
            }
        }