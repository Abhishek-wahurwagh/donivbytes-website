from typing import List, Optional

from sqlalchemy.orm import Session

from app.db.models import Chapter, Course, Subtopic, Topic
from app.schemas.course import CourseCreate, CourseUpdate
from app.schemas.curriculum import (
    ChapterCreate,
    ChapterUpdate,
    SubtopicCreate,
    SubtopicUpdate,
    TopicCreate,
    TopicUpdate,
)


# ─── Course ───────────────────────────────────────────────────────────────────


def create_course(db: Session, data: CourseCreate) -> Course:
    course = Course(**data.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def list_courses(
    db: Session, skip: int = 0, limit: int = 100
) -> List[Course]:
    return (
        db.query(Course)
        .order_by(Course.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_course(db: Session, course_id: int) -> Optional[Course]:
    return db.query(Course).filter(Course.id == course_id).first()


def get_course_by_slug(db: Session, slug: str) -> Optional[Course]:
    return db.query(Course).filter(Course.slug == slug).first()


def update_course(db: Session, course: Course, data: CourseUpdate) -> Course:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course: Course) -> None:
    db.delete(course)
    db.commit()


# ─── Chapter ──────────────────────────────────────────────────────────────────


def create_chapter(
    db: Session, course_id: int, data: ChapterCreate
) -> Chapter:
    chapter = Chapter(course_id=course_id, **data.model_dump())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


def list_chapters(db: Session, course_id: int) -> List[Chapter]:
    return (
        db.query(Chapter)
        .filter(Chapter.course_id == course_id)
        .order_by(Chapter.position)
        .all()
    )


def get_chapter(db: Session, chapter_id: int) -> Optional[Chapter]:
    return db.query(Chapter).filter(Chapter.id == chapter_id).first()


def update_chapter(
    db: Session, chapter: Chapter, data: ChapterUpdate
) -> Chapter:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(chapter, field, value)
    db.commit()
    db.refresh(chapter)
    return chapter


def delete_chapter(db: Session, chapter: Chapter) -> None:
    db.delete(chapter)
    db.commit()


# ─── Topic ────────────────────────────────────────────────────────────────────


def create_topic(db: Session, chapter_id: int, data: TopicCreate) -> Topic:
    topic = Topic(chapter_id=chapter_id, **data.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


def get_topic(db: Session, topic_id: int) -> Optional[Topic]:
    return db.query(Topic).filter(Topic.id == topic_id).first()


def update_topic(db: Session, topic: Topic, data: TopicUpdate) -> Topic:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(topic, field, value)
    db.commit()
    db.refresh(topic)
    return topic


def delete_topic(db: Session, topic: Topic) -> None:
    db.delete(topic)
    db.commit()


# ─── Subtopic ─────────────────────────────────────────────────────────────────


def create_subtopic(
    db: Session, topic_id: int, data: SubtopicCreate
) -> Subtopic:
    subtopic = Subtopic(topic_id=topic_id, **data.model_dump())
    db.add(subtopic)
    db.commit()
    db.refresh(subtopic)
    return subtopic


def get_subtopic(db: Session, subtopic_id: int) -> Optional[Subtopic]:
    return db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()


def update_subtopic(
    db: Session, subtopic: Subtopic, data: SubtopicUpdate
) -> Subtopic:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subtopic, field, value)
    db.commit()
    db.refresh(subtopic)
    return subtopic


def delete_subtopic(db: Session, subtopic: Subtopic) -> None:
    db.delete(subtopic)
    db.commit()
