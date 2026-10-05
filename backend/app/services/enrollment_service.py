from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session, selectinload

from app.db.models import (
    Chapter,
    Course,
    CourseStatus,
    Enrollment,
    EnrollmentStatus,
    EnrollmentType,
    LessonProgress,
    Subtopic,
    Topic,
)


# ─── Enrollment ───────────────────────────────────────────────────────────────


def get_enrollment(
    db: Session, user_id: int, course_id: int
) -> Optional[Enrollment]:
    return (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == user_id,
            Enrollment.course_id == course_id,
        )
        .first()
    )


def enroll_student(
    db: Session, user_id: int, course_id: int
) -> tuple[Enrollment, str]:
    """
    Attempt to enroll a student.
    Returns (enrollment, error_code) where error_code is None on success.
    error codes: "not_found", "not_published", "paid_course", "already_enrolled"
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return None, "not_found"
    if course.status != CourseStatus.PUBLISHED:
        return None, "not_published"
    if course.enrollment_type == EnrollmentType.PAID:
        return None, "paid_course"

    existing = get_enrollment(db, user_id, course_id)
    if existing:
        return None, "already_enrolled"

    enrollment = Enrollment(user_id=user_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment, None


def list_my_enrollments(db: Session, user_id: int) -> List[Enrollment]:
    return (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == user_id,
            Enrollment.status == EnrollmentStatus.ACTIVE,
        )
        .order_by(Enrollment.enrolled_at.desc())
        .all()
    )


def verify_enrollment(
    db: Session, user_id: int, course_id: int
) -> bool:
    """Return True if user has an ACTIVE enrollment in the course."""
    enrollment = get_enrollment(db, user_id, course_id)
    return enrollment is not None and enrollment.status == EnrollmentStatus.ACTIVE


# ─── Progress ─────────────────────────────────────────────────────────────────


def get_progress_record(
    db: Session, user_id: int, subtopic_id: int
) -> Optional[LessonProgress]:
    return (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user_id,
            LessonProgress.subtopic_id == subtopic_id,
        )
        .first()
    )


def get_subtopic_course_id(db: Session, subtopic_id: int) -> Optional[int]:
    """Walk subtopic → topic → chapter → course to find the course_id."""
    row = (
        db.query(Chapter.course_id)
        .join(Topic, Topic.chapter_id == Chapter.id)
        .join(Subtopic, Subtopic.topic_id == Topic.id)
        .filter(Subtopic.id == subtopic_id)
        .first()
    )
    return row[0] if row else None


def mark_complete(
    db: Session, user_id: int, subtopic_id: int
) -> LessonProgress:
    now = datetime.now(timezone.utc)
    record = get_progress_record(db, user_id, subtopic_id)
    if record:
        record.completed = True
        record.completed_at = now
    else:
        record = LessonProgress(
            user_id=user_id,
            subtopic_id=subtopic_id,
            completed=True,
            completed_at=now,
        )
        db.add(record)
    db.commit()
    db.refresh(record)
    return record


def unmark_complete(
    db: Session, user_id: int, subtopic_id: int
) -> LessonProgress:
    record = get_progress_record(db, user_id, subtopic_id)
    if record:
        record.completed = False
        record.completed_at = None
        db.commit()
        db.refresh(record)
        return record
    # Return a synthetic "not completed" object
    return LessonProgress(
        user_id=user_id, subtopic_id=subtopic_id, completed=False, completed_at=None
    )


def calculate_course_progress(
    db: Session, user_id: int, course_id: int
) -> dict:
    """
    Calculate progress from lesson_progress records.
    Returns a dict suitable for CourseProgressResponse.
    Never stores the percentage — always computed.
    """
    # Load full curriculum in one query
    chapters = (
        db.query(Chapter)
        .options(
            selectinload(Chapter.topics).selectinload(Topic.subtopics)
        )
        .filter(Chapter.course_id == course_id)
        .order_by(Chapter.position)
        .all()
    )

    # Collect all subtopic IDs
    all_subtopic_ids: List[int] = []
    for ch in chapters:
        for tp in ch.topics:
            for st in tp.subtopics:
                all_subtopic_ids.append(st.id)

    if not all_subtopic_ids:
        return {
            "course_id": course_id,
            "total_subtopics": 0,
            "completed_subtopics": 0,
            "percentage": 0.0,
            "chapters": [],
        }

    # Fetch completed progress records for this user in one query
    completed_ids = set(
        row[0]
        for row in db.query(LessonProgress.subtopic_id)
        .filter(
            LessonProgress.user_id == user_id,
            LessonProgress.subtopic_id.in_(all_subtopic_ids),
            LessonProgress.completed == True,  # noqa: E712
        )
        .all()
    )

    total = len(all_subtopic_ids)
    completed = len(completed_ids)

    chapter_progress = []
    for ch in chapters:
        ch_subs = [
            st.id for tp in ch.topics for st in tp.subtopics
        ]
        ch_done = sum(1 for sid in ch_subs if sid in completed_ids)
        chapter_progress.append(
            {
                "chapter_id": ch.id,
                "title": ch.title,
                "total_subtopics": len(ch_subs),
                "completed_subtopics": ch_done,
            }
        )

    return {
        "course_id": course_id,
        "total_subtopics": total,
        "completed_subtopics": completed,
        "percentage": round(completed / total * 100, 1) if total > 0 else 0.0,
        "chapters": chapter_progress,
    }
