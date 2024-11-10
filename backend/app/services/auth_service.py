

from datetime import datetime, timedelta, timezone
import jwt
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel
from models.user import User

class AuthService:
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

    def __init__(self, user_service, secret_key, algorithm):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.user_service = user_service
        self.secret_key = secret_key
        self.algorithm = algorithm

    class TokenData(BaseModel):
        username: str | None = None

    class UserInDB(User):
        password: str

    def verify_password(self, plain_password, password):
        return self.pwd_context.verify(plain_password, password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def authenticate_user(self, username: str, password: str):
        user = self.user_service.find_user_by_username(username)
        if not user:
            return False
        if not self.verify_password(password, user["hashed_password"]):
            return False
        return user

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt