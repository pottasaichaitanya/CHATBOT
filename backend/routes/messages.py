from google import genai
from  fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.models import User,Message,Chat
from pydantic import BaseModel, Field
from dbconnection.dbconnection import get_db
from typing import Optional
from config import API_KEY
from routes.authentication import get_current_user_id
client = genai.Client(api_key=API_KEY)

class MessageRequest(BaseModel):
    user_id: Optional[int] = None
    chat_id: int = Field(...)
    text: str = Field(...)

class CreateChatRequest(BaseModel):
    user_id: Optional[int] = None
    chat_id: Optional[int] = None
    new_name: Optional[str] = None

def get_response(text:str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=text+' in few lines',
    )
    return response.text

router = APIRouter()
@router.post("/request")
def create_request(request: MessageRequest, db: Session = Depends(get_db),user_info: dict = Depends(get_current_user_id)):
    if user_info["status"] == "error":
        return {"message": user_info["message"], "status": "error"}
    request.user_id = user_info["user_id"]
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        return {"message": "User not found", "status": "error"}
    response = get_response(request.text)
    new_message = Message(chat_id=request.chat_id, human_message=request.text, ai_message=response)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return {"message": "Message created successfully", "status": "success", "response": response}
@router.post("/create_chat")
def create_chat(request: CreateChatRequest, db: Session = Depends(get_db), user_info: dict = Depends(get_current_user_id)):
    if user_info["status"] == "error":
        return {"message": user_info["message"], "status": "error"}
    request.user_id = user_info["user_id"]
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        return {"message": "User not found", "status": "error"}
    new_chat = Chat(user_id=user.id, chat_name=None)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"message": "Chat created successfully", "status": "success", "chat_id": new_chat.id}

@router.post('/chat_conversation')
def get_chat_conversation(request: CreateChatRequest, db: Session = Depends(get_db), user_info: dict = Depends(get_current_user_id)):
    if user_info["status"] == "error":
        return {"message": user_info["message"], "status": "error"}
    request.user_id = user_info["user_id"]
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        return {"message": "User not found", "status": "error"}
    messages = db.query(Message).filter(Message.chat_id == request.chat_id).all()
    chat_messages=[]
    for message in messages:
        chat_messages.append({
            "human_message": message.human_message,
            "ai_message": message.ai_message,
            "timestamp": message.timestamp
        })
    chat_messages = sorted(chat_messages, key=lambda x: x['timestamp'])
    return {"message": "Chat history retrieved successfully","status": "success", "messages": chat_messages}
@router.post('/chat_history')
def get_chat_history(request: CreateChatRequest, db: Session = Depends(get_db), user_info: dict = Depends(get_current_user_id)):
    if user_info["status"] == "error":
        return {"message": user_info["message"], "status": "error"}
    request.user_id = user_info["user_id"]
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        return {"message": "User not found", "status": "error"}
    chats = db.query(Chat).filter(Chat.user_id == request.user_id).all()
    chat_history = []
    for chat in chats:
        messages = db.query(Message).filter(Message.chat_id == chat.id).all()
        if chat.id!=request.chat_id and not messages:
            db.delete(chat)
            db.commit()
            continue
        messages = sorted(messages, key=lambda x: x.timestamp, reverse=True)
        chat.timestamp = messages[0].timestamp
        words = messages[0].human_message.strip().split()
        chat.chat_name = ' '.join(words[:5])+'...' if len(words) > 5 else ' '.join(words)
        db.add(chat)
        chat_history.append({
            "chat_id": chat.id,
            "chat_name": chat.chat_name,
            "timestamp": chat.timestamp
        })
    chat_history = sorted(chat_history, key=lambda x: x['timestamp'], reverse=True)
    db.commit()
    return {"message": "Chat history retrieved successfully", "status": "success", "chat_history": chat_history}
