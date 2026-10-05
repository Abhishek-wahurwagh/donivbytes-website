from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models import User
from app.schemas.curriculum import (
    ChapterCreate,
    ChapterResponse,
    ChapterUpdate,
    SubtopicCreate,
    SubtopicResponse,
    SubtopicUpdate,
    TopicCreate,
    TopicResponse,
    TopicUpdate,
)
from app.services import course_service

router = APIRouter(prefix="/admin", tags=["admin-curriculum"])


# ─── Chapters ─────────────────────────────────────────────────────────────────


@router.post(
    "/courses/{course_id}/chapters",
    response_model=ChapterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a chapter to a course",
)
def create_chapter(
    course_id: int,
    body: ChapterCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> ChapterResponse:
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    chapter = course_service.create_chapter(db, course_id, body)
    return ChapterResponse.model_validate(chapter)


@router.get(
    "/courses/{course_id}/chapters",
    response_model=list[ChapterResponse],
    summary="List chapters for a course",
)
def list_chapters(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> list[ChapterResponse]:
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    chapters = course_service.list_chapters(db, course_id)
    return [ChapterResponse.model_validate(c) for c in chapters]


@router.patch(
    "/chapters/{chapter_id}",
    response_model=ChapterResponse,
    summary="Update a chapter",
)
def update_chapter(
    chapter_id: int,
    body: ChapterUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> ChapterResponse:
    chapter = course_service.get_chapter(db, chapter_id)
    if not chapter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found")
    updated = course_service.update_chapter(db, chapter, body)
    return ChapterResponse.model_validate(updated)


@router.delete(
    "/chapters/{chapter_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a chapter",
)
def delete_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    chapter = course_service.get_chapter(db, chapter_id)
    if not chapter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found")
    course_service.delete_chapter(db, chapter)


# ─── Topics ───────────────────────────────────────────────────────────────────


@router.post(
    "/chapters/{chapter_id}/topics",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a topic to a chapter",
)
def create_topic(
    chapter_id: int,
    body: TopicCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> TopicResponse:
    chapter = course_service.get_chapter(db, chapter_id)
    if not chapter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found")
    topic = course_service.create_topic(db, chapter_id, body)
    return TopicResponse.model_validate(topic)


@router.patch(
    "/topics/{topic_id}",
    response_model=TopicResponse,
    summary="Update a topic",
)
def update_topic(
    topic_id: int,
    body: TopicUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> TopicResponse:
    topic = course_service.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    updated = course_service.update_topic(db, topic, body)
    return TopicResponse.model_validate(updated)


@router.delete(
    "/topics/{topic_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a topic",
)
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    topic = course_service.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    course_service.delete_topic(db, topic)


# ─── Subtopics ────────────────────────────────────────────────────────────────


@router.post(
    "/topics/{topic_id}/subtopics",
    response_model=SubtopicResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a subtopic to a topic",
)
def create_subtopic(
    topic_id: int,
    body: SubtopicCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> SubtopicResponse:
    topic = course_service.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    subtopic = course_service.create_subtopic(db, topic_id, body)
    return SubtopicResponse.model_validate(subtopic)


@router.patch(
    "/subtopics/{subtopic_id}",
    response_model=SubtopicResponse,
    summary="Update a subtopic",
)
def update_subtopic(
    subtopic_id: int,
    body: SubtopicUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> SubtopicResponse:
    subtopic = course_service.get_subtopic(db, subtopic_id)
    if not subtopic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtopic not found")
    updated = course_service.update_subtopic(db, subtopic, body)
    return SubtopicResponse.model_validate(updated)


@router.delete(
    "/subtopics/{subtopic_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a subtopic",
)
def delete_subtopic(
    subtopic_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    subtopic = course_service.get_subtopic(db, subtopic_id)
    if not subtopic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtopic not found")
    course_service.delete_subtopic(db, subtopic)
