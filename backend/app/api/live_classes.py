"""
Live class endpoints.

Admin:
  POST   /api/v1/admin/courses/{course_id}/live-classes
  GET    /api/v1/admin/courses/{course_id}/live-classes
  GET    /api/v1/admin/live-classes/{live_class_id}
  PATCH  /api/v1/admin/live-classes/{live_class_id}
  DELETE /api/v1/admin/live-classes/{live_class_id}

Student (enrolled only):
  GET    /api/v1/me/courses/{course_id}/live-classes
"""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.db.database import get_db
from app.db.models import Course, Enrollment, EnrollmentStatus, LiveClass, User
from app.schemas.live_class import (
    LiveClassCreate,
    LiveClassResponse,
    LiveClassUpdate,
)

router = APIRouter(tags=["live-classes"])


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _get_course_or_404(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def _get_live_class_or_404(db: Session, live_class_id: int) -> LiveClass:
    lc = db.query(LiveClass).filter(LiveClass.id == live_class_id).first()
    if not lc:
        raise HTTPException(status_code=404, detail="Live class not found")
    return lc


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


# ─── Admin endpoints ──────────────────────────────────────────────────────────


@router.post(
    "/admin/courses/{course_id}/live-classes",
    response_model=LiveClassResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a live class for a course",
)
def create_live_class(
    course_id: int,
    body: LiveClassCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> LiveClassResponse:
    _get_course_or_404(db, course_id)
    lc = LiveClass(
        course_id=course_id,
        title=body.title,
        description=body.description,
        start_time=body.start_time,
        end_time=body.end_time,
        meet_url=body.meet_url,
    )
    db.add(lc)
    db.commit()
    db.refresh(lc)
    return LiveClassResponse.model_validate(lc)


@router.get(
    "/admin/courses/{course_id}/live-classes",
    response_model=List[LiveClassResponse],
    summary="List live classes for a course (admin)",
)
def list_live_classes_admin(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> List[LiveClassResponse]:
    _get_course_or_404(db, course_id)
    classes = (
        db.query(LiveClass)
        .filter(LiveClass.course_id == course_id)
        .order_by(LiveClass.start_time)
        .all()
    )
    return [LiveClassResponse.model_validate(lc) for lc in classes]


@router.get(
    "/admin/live-classes/{live_class_id}",
    response_model=LiveClassResponse,
    summary="Get a live class by ID (admin)",
)
def get_live_class_admin(
    live_class_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> LiveClassResponse:
    lc = _get_live_class_or_404(db, live_class_id)
    return LiveClassResponse.model_validate(lc)


@router.patch(
    "/admin/live-classes/{live_class_id}",
    response_model=LiveClassResponse,
    summary="Update a live class (admin)",
)
def update_live_class(
    live_class_id: int,
    body: LiveClassUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> LiveClassResponse:
    lc = _get_live_class_or_404(db, live_class_id)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(lc, field, value)
    # Re-validate end > start after partial update
    if lc.end_time <= lc.start_time:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_time must be after start_time",
        )
    db.commit()
    db.refresh(lc)
    return LiveClassResponse.model_validate(lc)


@router.delete(
    "/admin/live-classes/{live_class_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a live class (admin)",
)
def delete_live_class(
    live_class_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    lc = _get_live_class_or_404(db, live_class_id)
    db.delete(lc)
    db.commit()


# ─── Student endpoint — meet_url included, enrollment verified ────────────────


@router.get(
    "/me/courses/{course_id}/live-classes",
    response_model=List[LiveClassResponse],
    summary="Get live classes for an enrolled course (student)",
)
def list_live_classes_student(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[LiveClassResponse]:
    _get_course_or_404(db, course_id)

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id,
            Enrollment.status == EnrollmentStatus.ACTIVE,
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in this course to view live classes",
        )

    now = _now_utc()
    all_classes = (
        db.query(LiveClass)
        .filter(LiveClass.course_id == course_id)
        .order_by(LiveClass.start_time)
        .all()
    )

    def _as_aware(dt: datetime) -> datetime:
        """Ensure datetime is timezone-aware (SQLite returns naive UTC datetimes)."""
        if dt.tzinfo is None:
            from datetime import timezone as _tz
            return dt.replace(tzinfo=_tz.utc)
        return dt

    # Upcoming first, then past
    upcoming = [lc for lc in all_classes if _as_aware(lc.start_time) >= now]
    past = [lc for lc in all_classes if _as_aware(lc.start_time) < now]
    return [LiveClassResponse.model_validate(lc) for lc in upcoming + past]
