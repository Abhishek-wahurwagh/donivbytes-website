from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.db.models import EnrollmentStatus
from app.schemas.public_course import PublicCourseListResponse


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    status: EnrollmentStatus
    enrolled_at: datetime

    model_config = {"from_attributes": True}


class MyCourseResponse(BaseModel):
    """Enrollment + course summary + progress for /me/courses."""
    enrollment_id: int
    status: EnrollmentStatus
    enrolled_at: datetime
    progress: float  # 0.0 – 100.0, calculated on the fly
    course: PublicCourseListResponse

    model_config = {"from_attributes": True}


class SubtopicProgressResponse(BaseModel):
    subtopic_id: int
    completed: bool
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}


class ChapterProgressResponse(BaseModel):
    chapter_id: int
    title: str
    total_subtopics: int
    completed_subtopics: int


class CourseProgressResponse(BaseModel):
    course_id: int
    total_subtopics: int
    completed_subtopics: int
    percentage: float
    chapters: list[ChapterProgressResponse] = []
