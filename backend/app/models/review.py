from datetime import datetime, timezone
import uuid

from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    resume_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "resumes.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    job_requirement = db.Column(
        db.Text,
        nullable=False,
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="queued",
        index=False,
    )

    ats_score = db.Column(
        db.Integer,
        nullable=True,
    )

    summary = db.Column(
        db.Text,
        nullable=True,
    )

    strengths = db.Column(
        JSONB,
        nullable=True,
    )

    missing_skills = db.Column(
        JSONB,
        nullable=True,
    )

    recommendations = db.Column(
        JSONB,
        nullable=True,
    )

    error_message = db.Column(
        db.Text,
        nullable=True,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    resume = db.relationship(
        "Resume",
        back_populates="reviews",
    )

    __table_args__ = (
        Index(
            "idx_review_resume",
            "resume_id",
        ),
        Index(
            "idx_reviews_status",
            "status",
        ),
    )