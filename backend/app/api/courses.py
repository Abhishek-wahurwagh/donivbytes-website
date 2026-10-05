from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models import User
from app.schemas.course import CourseCreate, CourseListResponse, CourseResponse, CourseUpdate
from app.services import course_service

router = APIRouter(prefix="/admin/courses", tags=["admin-courses"])


@router.post(
    "",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a course",
)
def create_course(
    body: CourseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> CourseResponse:
    if course_service.get_course_by_slug(db, body.slug):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A course with slug '{body.slug}' already exists",
        )
    course = course_service.create_course(db, body)
    return CourseResponse.model_validate(course)


@router.get(
    "",
    response_model=list[CourseListResponse],
    summary="List all courses",
)
def list_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> list[CourseListResponse]:
    courses = course_service.list_courses(db, skip=skip, limit=limit)
    return [CourseListResponse.model_validate(c) for c in courses]


@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Get a course by ID",
)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> CourseResponse:
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return CourseResponse.model_validate(course)


@router.patch(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Update a course",
)
def update_course(
    course_id: int,
    body: CourseUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> CourseResponse:
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    if body.slug and body.slug != course.slug:
        if course_service.get_course_by_slug(db, body.slug):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A course with slug '{body.slug}' already exists",
            )
    updated = course_service.update_course(db, course, body)
    return CourseResponse.model_validate(updated)


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a course",
)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
) -> None:
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    course_service.delete_course(db, course)
