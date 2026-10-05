from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import (
    AdminUserResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    get_user_by_email,
    login_and_issue_token,
    register_student,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Student registration",
)
def register(body: RegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    if get_user_by_email(db, body.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    if len(body.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters",
        )
    user = register_student(db, name=body.name, email=body.email, password=body.password)
    return UserResponse.model_validate(user)


@router.post("/login", response_model=TokenResponse, summary="Login (admin or student)")
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    token = login_and_issue_token(db, body.email, body.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse, summary="Current user info")
def me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)
