from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token, hash_password
from app.db.models import User, UserRole


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Return any active user whose credentials are valid, regardless of role."""
    user = get_user_by_email(db, email)
    if not user or not user.is_active:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


# Keep Phase 1 name as a thin wrapper so existing admin code doesn't break
def authenticate_admin(db: Session, email: str, password: str) -> Optional[User]:
    user = authenticate_user(db, email, password)
    if user and user.role != UserRole.admin:
        return None
    return user


def create_admin_user(
    db: Session, name: str, email: str, password: str
) -> User:
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def register_student(
    db: Session, name: str, email: str, password: str
) -> User:
    """Create a new student account. Caller must check email uniqueness first."""
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.student,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_and_issue_token(
    db: Session, email: str, password: str
) -> Optional[str]:
    """Authenticate any user (admin or student) and return a JWT."""
    user = authenticate_user(db, email, password)
    if not user:
        return None
    return create_access_token(subject=user.id)
