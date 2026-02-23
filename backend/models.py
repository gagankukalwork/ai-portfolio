from sqlalchemy import Column, Integer, Text
from database import Base

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text)
    answer = Column(Text)