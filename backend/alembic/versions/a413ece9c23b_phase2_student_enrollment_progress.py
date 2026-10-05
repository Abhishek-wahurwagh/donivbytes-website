"""phase2_student_enrollment_progress

Revision ID: a413ece9c23b
Revises: b3045c0ecee1
Create Date: 2026-10-06

Changes:
- Add 'student' value to the userrole enum
- Create enrollments table
- Create lesson_progress table
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a413ece9c23b"
down_revision: Union[str, None] = "b3045c0ecee1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Extend userrole enum with 'student' (PostgreSQL only) ──────────────
    # SQLite does not have native enum types so we check the dialect.
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'student'")

    # ── enrollments ────────────────────────────────────────────────────────
    op.create_table(
        "enrollments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("course_id", sa.Integer(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("ACTIVE", "COMPLETED", "CANCELLED", name="enrollmentstatus"),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column(
            "enrolled_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "course_id", name="uq_enrollment_user_course"),
    )
    op.create_index(op.f("ix_enrollments_id"), "enrollments", ["id"], unique=False)
    op.create_index(
        op.f("ix_enrollments_user_id"), "enrollments", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_enrollments_course_id"), "enrollments", ["course_id"], unique=False
    )

    # ── lesson_progress ────────────────────────────────────────────────────
    op.create_table(
        "lesson_progress",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("subtopic_id", sa.Integer(), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["subtopic_id"], ["subtopics.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id", "subtopic_id", name="uq_progress_user_subtopic"
        ),
    )
    op.create_index(
        op.f("ix_lesson_progress_id"), "lesson_progress", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_lesson_progress_user_id"), "lesson_progress", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_lesson_progress_subtopic_id"),
        "lesson_progress",
        ["subtopic_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_table("lesson_progress")
    op.drop_table("enrollments")
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("DROP TYPE IF EXISTS enrollmentstatus")
        # Note: cannot remove a value from a PostgreSQL enum without recreating it.
        # The 'student' value remains in the userrole enum after downgrade.
