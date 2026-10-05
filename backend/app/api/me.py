"""
/api/v1/me/* — student self-service endpoints.
All require authentication (any role can call /me/courses etc.,
but enrollment/progress is always scoped to the calling user).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Course, EnrollmentType, User
from app.schemas.enrollment import (
    CourseProgressResponse,
    EnrollmentResponse,
    MyCourseResponse,
    SubtopicProgressResponse,
)
from app.schemas.public_course import PublicCourseListResponse
from app.services.enrollment_service import (
    calculate_course_progress,
    enroll_student,
    get_progress_record,
    get_subtopic_course_id,
    list_my_enrollments,
    mark_complete,
    unmark_complete,
    verify_enrollment,
)
from app.db.models import Subtopic

router = APIRouter(prefix="/me", tags=["me"])


@router.post(
    "/courses/{course_id}/enroll",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enroll in a FREE course",
)
def enroll(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EnrollmentResponse:
    enrollment, error = enroll_student(db, current_user.id, course_id)
    if error == "not_found":
        raise HTTPException(status_code=404, detail="Course not found")
    if error == "not_published":
        raise HTTPException(status_code=404, detail="Course not found or not published")
    if error == "paid_course":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="This course requires payment, which is not yet supported",
        )
    if error == "already_enrolled":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already enrolled in this course",
        )
    return EnrollmentResponse.model_validate(enrollment)


@router.get(
    "/courses",
    response_model=list[MyCourseResponse],
    summary="My enrolled courses with progress",
)
def my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MyCourseResponse]:
    enrollments = list_my_enrollments(db, current_user.id)
    result = []
    for enr in enrollments:
        prog = calculate_course_progress(db, current_user.id, enr.course_id)
        result.append(
            MyCourseResponse(
                enrollment_id=enr.id,
                status=enr.status,
                enrolled_at=enr.enrolled_at,
                progress=prog["percentage"],
                course=PublicCourseListResponse.model_validate(enr.course),
            )
        )
    return result


@router.get(
    "/courses/{course_id}/progress",
    response_model=CourseProgressResponse,
    summary="Detailed progress for one enrolled course",
)
def course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CourseProgressResponse:
    if not verify_enrollment(db, current_user.id, course_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not enrolled in this course",
        )
    prog = calculate_course_progress(db, current_user.id, course_id)
    return CourseProgressResponse(**prog)


@router.post(
    "/subtopics/{subtopic_id}/complete",
    response_model=SubtopicProgressResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark a subtopic as complete",
)
def mark_subtopic_complete(
    subtopic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SubtopicProgressResponse:
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")

    course_id = get_subtopic_course_id(db, subtopic_id)
    if not course_id or not verify_enrollment(db, current_user.id, course_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in the course to track progress",
        )

    record = mark_complete(db, current_user.id, subtopic_id)
    return SubtopicProgressResponse(
        subtopic_id=record.subtopic_id,
        completed=record.completed,
        completed_at=record.completed_at,
    )


@router.delete(
    "/subtopics/{subtopic_id}/complete",
    response_model=SubtopicProgressResponse,
    summary="Unmark a subtopic as complete",
)
def unmark_subtopic_complete(
    subtopic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SubtopicProgressResponse:
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")

    course_id = get_subtopic_course_id(db, subtopic_id)
    if not course_id or not verify_enrollment(db, current_user.id, course_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in the course to track progress",
        )

    record = unmark_complete(db, current_user.id, subtopic_id)
    return SubtopicProgressResponse(
        subtopic_id=subtopic_id,
        completed=record.completed,
        completed_at=record.completed_at,
    )


@router.get(
    "/courses/{course_id}/content",
    summary="Verify enrolled access to course content",
    response_model=dict,
)
def course_content_access(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Backend-enforced access gate for learning content.
    Returns 200 {"access": true} if enrolled, 403 otherwise.
    The frontend hits this before rendering protected lesson content.
    """
    if not verify_enrollment(db, current_user.id, course_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled to access course content",
        )
    return {"access": True, "course_id": course_id}
