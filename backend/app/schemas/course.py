from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

from app.db.models import CourseDifficulty, CourseStatus, EnrollmentType


# ─── Course ───────────────────────────────────────────────────────────────────


class CourseCreate(BaseModel):
    title: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[CourseDifficulty] = None
    thumbnail_url: Optional[str] = None
    start_date: Optional[datetime] = None
    enrollment_type: EnrollmentType = EnrollmentType.FREE
    price: Optional[float] = None
    status: CourseStatus = CourseStatus.DRAFT

    @model_validator(mode="after")
    def validate_price(self) -> "CourseCreate":
        if self.enrollment_type == EnrollmentType.PAID:
            if self.price is None or self.price <= 0:
                raise ValueError("PAID courses must have a price greater than 0")
        if self.enrollment_type == EnrollmentType.FREE:
            if self.price is not None and self.price > 0:
                raise ValueError("FREE courses should not have a price")
        return self

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v.strip()

    @field_validator("slug")
    @classmethod
    def slug_format(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("slug must not be empty")
        return v


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[CourseDifficulty] = None
    thumbnail_url: Optional[str] = None
    start_date: Optional[datetime] = None
    enrollment_type: Optional[EnrollmentType] = None
    price: Optional[float] = None
    status: Optional[CourseStatus] = None

    @model_validator(mode="after")
    def validate_price(self) -> "CourseUpdate":
        if self.enrollment_type == EnrollmentType.PAID:
            if self.price is None or self.price <= 0:
                raise ValueError("PAID courses must have a price greater than 0")
        if self.enrollment_type == EnrollmentType.FREE and self.price is not None:
            if self.price > 0:
                raise ValueError("FREE courses should not have a price")
        return self


class CourseResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: Optional[str]
    description: Optional[str]
    difficulty: Optional[CourseDifficulty]
    thumbnail_url: Optional[str]
    start_date: Optional[datetime]
    enrollment_type: EnrollmentType
    price: Optional[float]
    status: CourseStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CourseListResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: Optional[str]
    difficulty: Optional[CourseDifficulty]
    enrollment_type: EnrollmentType
    price: Optional[float]
    status: CourseStatus
    start_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
