"""
Public-facing course schemas — safe for unauthenticated responses.
No admin-only fields. Nested curriculum included in detail view.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.db.models import CourseDifficulty, CourseStatus, EnrollmentType


class PublicSubtopicResponse(BaseModel):
    id: int
    title: str
    position: int

    model_config = {"from_attributes": True}


class PublicTopicResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    position: int
    subtopics: List[PublicSubtopicResponse] = []

    model_config = {"from_attributes": True}


class PublicChapterResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    position: int
    topics: List[PublicTopicResponse] = []

    model_config = {"from_attributes": True}


class PublicCourseListResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: Optional[str]
    thumbnail_url: Optional[str]
    difficulty: Optional[CourseDifficulty]
    start_date: Optional[datetime]
    enrollment_type: EnrollmentType
    price: Optional[float]

    model_config = {"from_attributes": True}


class PublicCourseDetailResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: Optional[str]
    description: Optional[str]
    thumbnail_url: Optional[str]
    difficulty: Optional[CourseDifficulty]
    start_date: Optional[datetime]
    enrollment_type: EnrollmentType
    price: Optional[float]
    chapters: List[PublicChapterResponse] = []

    model_config = {"from_attributes": True}
