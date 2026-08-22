from datetime import datetime, timezone
import uuid

from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import UUID

from app.extensions import db


class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    filename = db.Column(
        db.Text,
        nullable=False,
    )

    storage_path = db.Column(
        db.Text,
        nullable=False,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship(
        "User",
        back_populates="resumes",
    )

    reviews = db.relationship(
        "Review",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index(
            "idx_resume_user",
            "user_id",
        ),
    )