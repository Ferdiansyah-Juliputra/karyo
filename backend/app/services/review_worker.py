from uuid import UUID

from app.extensions import db
from app.loaders.document_loader import load_document
from app.models.review import Review
from app.services.resume_review import review_resume


def process_review(review_id: str) -> None:
    """
    Process a queued review in the background.

    The review state is persisted in PostgreSQL so the process
    can be recovered after a frontend refresh or disconnection.
    """

    try:
        review = db.session.get(
            Review,
            UUID(review_id),
        )

        if review is None:
            return

        review.status = "processing"
        db.session.commit()

        resume = review.resume

        document = load_document(
            resume.storage_path,
        )

        result = review_resume(
            resume=document,
            requirement=review.job_requirement,
        )

        review.ats_score = result.ats_score
        review.summary = result.summary
        review.strengths = result.strengths
        review.missing_skills = result.missing_skills
        review.recommendations = result.recommendations
        review.status = "completed"
        review.error_message = None

        db.session.commit()

    except Exception as error:
        db.session.rollback()

        try:
            review = db.session.get(
                Review,
                UUID(review_id),
            )

            if review is not None:
                review.status = "failed"
                review.error_message = str(error)
                db.session.commit()

        except Exception:
            db.session.rollback()

        raise

    finally:
        db.session.remove()