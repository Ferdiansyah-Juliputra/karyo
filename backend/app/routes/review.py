from pathlib import Path

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from app.config.config import UPLOAD_FOLDER
from app.extensions import limiter
from app.loaders.document_loader import load_document
from app.services.resume_review import review_resume

review_bp = Blueprint("review", __name__)


@review_bp.route("/review", methods=["POST"])
@limiter.limit(lambda: current_app.config["RATELIMIT_REVIEW_LIMITS"])
def review():
    """
    Review Resume
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
      200:
        description: Resume reviewed successfully

      400:
        description: Invalid request

      500:
        description: Internal server error
    """

    file = request.files.get("resume")
    requirement = request.form.get("requirement")

    if file is None:
        return jsonify({
            "success": False,
            "message": "Resume file is required."
        }), 400

    if not requirement:
        return jsonify({
            "success": False,
            "message": "Job requirement is required."
        }), 400

    upload_folder = Path(UPLOAD_FOLDER)
    upload_folder.mkdir(parents=True, exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = upload_folder / filename

    file.save(file_path)

    resume = load_document(
        str(file_path),
    )

    result = review_resume(
        resume=resume,
        requirement=requirement,
    )

    return jsonify({
        "success": True,
        "data": result.model_dump()
    }), 200
