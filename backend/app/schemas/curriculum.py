from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


# ─── Chapter ──────────────────────────────────────────────────────────────────


class ChapterCreate(BaseModel):
    title: str
    description: Optional[str] = None
    position: int = 0

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()


class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None


class ChapterResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Topic ────────────────────────────────────────────────────────────────────


class TopicCreate(BaseModel):
    title: str
    description: Optional[str] = None
    position: int = 0

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()


class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None


class TopicResponse(BaseModel):
    id: int
    chapter_id: int
    title: str
    description: Optional[str]
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Subtopic ─────────────────────────────────────────────────────────────────


class SubtopicCreate(BaseModel):
    title: str
    content: Optional[str] = None
    position: int = 0

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()


class SubtopicUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    position: Optional[int] = None


class SubtopicResponse(BaseModel):
    id: int
    topic_id: int
    title: str
    content: Optional[str]
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
