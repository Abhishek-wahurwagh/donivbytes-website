from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl, field_validator, model_validator


class LiveClassCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    meet_url: str  # stored as plain str; validated as URL below

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()

    @field_validator("meet_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("meet_url must be a valid HTTP/HTTPS URL")
        return v

    @model_validator(mode="after")
    def end_after_start(self) -> "LiveClassCreate":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class LiveClassUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    meet_url: Optional[str] = None

    @field_validator("meet_url")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("meet_url must be a valid HTTP/HTTPS URL")
        return v

    @model_validator(mode="after")
    def end_after_start(self) -> "LiveClassUpdate":
        if self.start_time and self.end_time:
            if self.end_time <= self.start_time:
                raise ValueError("end_time must be after start_time")
        return self


class LiveClassResponse(BaseModel):
    """Full response — includes meet_url. Only for admin and enrolled students."""
    id: int
    course_id: int
    title: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    meet_url: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LiveClassPublicResponse(BaseModel):
    """Public response — omits meet_url."""
    id: int
    course_id: int
    title: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime

    model_config = {"from_attributes": True}
