import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class DiaryEntry(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, alias="_id")
    author: str = Field(...)
    entry_date: datetime = Field(default_factory=datetime.now)
    content: str = Field(...)
    predicted_class_number: int = Field(default_factory=lambda: 0)
    prediction_class: str = Field(default_factory=lambda: "")
    confidence: float = Field(default_factory=lambda: 0.0)
    confidence_scores: dict = Field(default_factory=lambda: {})
    advice: Optional[str] = Field(default_factory=lambda: "")
    created: datetime = Field(default_factory=datetime.now)
    updated: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "author": "69b02b85-4141-4a42-a15c-7437e2eab455",
                "entry_date": "2032-04-23T10:20:30.400+02:30",
                "content": "I go to school by bus",
                "created": "2032-04-23T10:20:30.400+02:30",
                "updated": "2032-04-23T10:20:30.400+02:30"
            }
        }

class DiaryEntryUpdate(BaseModel):
    content: Optional[str]
    updated: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Don Quixote is a Spanish novel by Miguel de Cervantes..."
            }
        }