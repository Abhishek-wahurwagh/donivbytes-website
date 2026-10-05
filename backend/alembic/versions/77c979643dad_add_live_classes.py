"""add_live_classes

Revision ID: 77c979643dad
Revises: a413ece9c23b
Create Date: 2026-10-06

Changes:
- Create live_classes table
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "77c979643dad"
down_revision: Union[str, None] = "a413ece9c23b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "live_classes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("course_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("meet_url", sa.String(2000), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_live_classes_id"), "live_classes", ["id"], unique=False)
    op.create_index(
        op.f("ix_live_classes_course_id"), "live_classes", ["course_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_live_classes_course_id"), table_name="live_classes")
    op.drop_index(op.f("ix_live_classes_id"), table_name="live_classes")
    op.drop_table("live_classes")
