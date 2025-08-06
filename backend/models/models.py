from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime,timezone
from dbconnection.dbconnection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    chats = relationship("Chat", back_populates="user")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    chat_name = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete")
    


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    human_message = Column(String, nullable=False)
    ai_message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    chat = relationship("Chat", back_populates="messages")
