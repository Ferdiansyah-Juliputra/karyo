from pathlib import Path
from uuid import UUID
from concurrent.futures import ThreadPoolExecutor

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

from app.config.config import UPLOAD_FOLDER
from app.extensions import db, limiter
from app.models.resume import Resume
from app.models.review import Review
from app.services.review_worker import process_review


review_bp = Blueprint("review", __name__)

executor = ThreadPoolExecutor(max_workers=2)


@review_bp.route("/review", methods=["POST"])
@jwt_required()
@limiter.limit(lambda: current_app.config["RATELIMIT_REVIEW_LIMITS"])
def review():
    """
    Create Resume Review Job
    ---
    tags:
      - Review

    consumes:
      - multipart/form-data

    parameters:
      - in: formData
        name: resume
        type: file
        required: true
        description: Resume file (PDF/DOCX)

      - in: formData
        name: requirement
        type: string
        required: true
        description: Job description

    responses:
      202:
        description: Review job accepted

      400:
        description: Invalid request

      401:
        description: Authentication required

      500:
        description: Internal server error
    """

    file = request.files.get("resume")
    requirement = request.form.get("requirement")
    user_id = get_jwt_identity()

    if file is None:
        return jsonify({
            "success": False,
            "message": "Resume file is required.",
        }), 400

    if not requirement or not requirement.strip():
        return jsonify({
            "success": False,
            "message": "Job requirement is required.",
        }), 400

    if not file.filename:
        return jsonify({
            "success": False,
            "message": "Resume filename is required.",
        }), 400

    upload_folder = Path(UPLOAD_FOLDER)
    upload_folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = secure_filename(file.filename)

    if not filename:
        return jsonify({
            "success": False,
            "message": "Invalid resume filename.",
        }), 400

    file_path = upload_folder / filename

    file.save(file_path)

    try:
        resume_record = Resume(
            user_id=UUID(user_id),
            filename=filename,
            storage_path=str(file_path),
        )

        db.session.add(resume_record)
        db.session.flush()

        review_record = Review(
            resume_id=resume_record.id,
            job_requirement=requirement.strip(),
            status="queued",
        )

        db.session.add(review_record)
        db.session.commit()

        review_id = str(review_record.id)

    except Exception:
        db.session.rollback()

        if file_path.exists():
            file_path.unlink()

        raise

    app = current_app._get_current_object()

    executor.submit(
        _run_review_in_app_context,
        app,
        review_id,
    )

    return jsonify({
        "success": True,
        "review_id": review_id,
        "status": "queued",
    }), 202


def _run_review_in_app_context(
    app,
    review_id: str,
) -> None:
    """
    Run the background review inside Flask application context.
    """

    with app.app_context():
        process_review(review_id)


@review_bp.route("/review/<review_id>", methods=["GET"])
@jwt_required()
def get_review(review_id):
    """
    Get Review Status
    ---
    tags:
      - Review

    parameters:
      - in: path
        name: review_id
        type: string
        required: true

    responses:
      200:
        description: Review status/result

      400:
        description: Invalid review ID

      404:
        description: Review not found

      401:
        description: Authentication required
    """

    try:
        review_uuid = UUID(review_id)
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Invalid review ID.",
        }), 400

    user_id = UUID(get_jwt_identity())

    review = (
        Review.query
        .join(Review.resume)
        .filter(
            Review.id == review_uuid,
            Resume.user_id == user_id,
        )
        .first()
    )

    if review is None:
        return jsonify({
            "success": False,
            "message": "Review not found.",
        }), 404

    response = {
        "id": str(review.id),
        "status": review.status,
        "job_requirement": review.job_requirement,
        "resume": {
            "id": str(review.resume.id),
            "filename": review.resume.filename,
        },
        "created_at": (
            review.created_at.isoformat()
            if review.created_at
            else None
        ),
        "updated_at": (
            review.updated_at.isoformat()
            if review.updated_at
            else None
        ),
    }

    if review.status == "completed":
        response["data"] = {
            "ats_score": review.ats_score,
            "summary": review.summary,
            "strengths": review.strengths,
            "missing_skills": review.missing_skills,
            "recommendations": review.recommendations,
        }

    if review.status == "failed":
        response["error"] = review.error_message

    return jsonify({
        "success": True,
        "data": response,
    }), 200