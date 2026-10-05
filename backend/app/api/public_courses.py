"""
Public course endpoints — no authentication required.
Only PUBLISHED courses are ever returned.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.db.models import Chapter, Course, CourseStatus, Subtopic, Topic
from app.schemas.public_course import (
    PublicCourseDetailResponse,
    PublicCourseListResponse,
)

router = APIRouter(prefix="/courses", tags=["courses"])


def _published(db: Session) -> "type[Course]":
    """Base query helper — only PUBLISHED courses."""
    return db.query(Course).filter(Course.status == CourseStatus.PUBLISHED)


@router.get(
    "",
    response_model=list[PublicCourseListResponse],
    summary="List published courses",
)
def list_courses(db: Session = Depends(get_db)) -> list[PublicCourseListResponse]:
    courses = (
        _published(db)
        .order_by(Course.created_at.desc())
        .all()
    )
    return [PublicCourseListResponse.model_validate(c) for c in courses]


@router.get(
    "/{course_id}",
    response_model=PublicCourseDetailResponse,
    summary="Get published course with curriculum",
)
def get_course(
    course_id: int, db: Session = Depends(get_db)
) -> PublicCourseDetailResponse:
    course = (
        _published(db)
        .options(
            selectinload(Course.chapters)
            .selectinload(Chapter.topics)
            .selectinload(Topic.subtopics)
        )
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or not published",
        )

    # Build sorted nested structure
    from app.schemas.public_course import (
        PublicChapterResponse,
        PublicSubtopicResponse,
        PublicTopicResponse,
    )

    chapters = []
    for ch in sorted(course.chapters, key=lambda c: c.position):
        topics = []
        for tp in sorted(ch.topics, key=lambda t: t.position):
            subtopics = [
                PublicSubtopicResponse.model_validate(s)
                for s in sorted(tp.subtopics, key=lambda s: s.position)
            ]
            topics.append(
                PublicTopicResponse(
                    id=tp.id,
                    title=tp.title,
                    description=tp.description,
                    position=tp.position,
                    subtopics=subtopics,
                )
            )
        chapters.append(
            PublicChapterResponse(
                id=ch.id,
                title=ch.title,
                description=ch.description,
                position=ch.position,
                topics=topics,
            )
        )

    return PublicCourseDetailResponse(
        id=course.id,
        title=course.title,
        slug=course.slug,
        short_description=course.short_description,
        description=course.description,
        thumbnail_url=course.thumbnail_url,
        difficulty=course.difficulty,
        start_date=course.start_date,
        enrollment_type=course.enrollment_type,
        price=course.price,
        chapters=chapters,
    )
