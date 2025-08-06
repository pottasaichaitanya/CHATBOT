from models.models import User, Chat
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from dbconnection.dbconnection import SessionLocal, get_db
from passlib.context import CryptContext
from jose import jwt    
from datetime import datetime, timedelta ,timezone  
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
router = APIRouter()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class LoginRequest(BaseModel):
    username: str = Field(...)
    password: str = Field(...)




@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not pwd_context.verify(request.password, user.password):
        return {"message": "Invalid username or password", "status": "error"}
    access_token = create_access_token(data={"user_name": user.username, "user_id": user.id})
    new_chat = Chat(user_id=user.id,)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"message": "Login successful", "status": "success", "chat_id": new_chat.id, "access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(request: LoginRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
       return {"message": "Username already exists", "status": "error"}
    
    hashed_password = pwd_context.hash(request.password)
    new_user = User(username=request.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_chat = Chat(user_id=new_user.id)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"message": "User registered successfully","status": "success", "chat_id": new_chat.id,"access_token": create_access_token(data={"user_name": new_user.username, "user_id": new_user.id}), "token_type": "bearer"}
