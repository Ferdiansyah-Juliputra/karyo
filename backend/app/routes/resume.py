from pathlib import Path
from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request
from app.config.config import UPLOAD_FOLDER
from app.loaders.document_loader import load_document

UPLOAD_FOLDER = Path(UPLOAD_FOLDER)

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/resume", methods=["POST"])
def upload_resume():
    file = request.files.get("file")

    if not file:
        return jsonify({
            "success": False,
            "message": "No file uploaded."
        }), 400

    filename = secure_filename(file.filename)
    file_path = UPLOAD_FOLDER / filename
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

    file.save(file_path)

    content = load_document(
        str(file_path),
    )

    return jsonify({
        "success": True,
        "data": {
            "filename": filename,
            "content": content
        }
    }), 200