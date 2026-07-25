from flask import Blueprint, jsonify

from app.config.config import OPENROUTER_MODEL
from app.extensions import limiter

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
@limiter.exempt
def health():
    """
    Check health status
    ---
    tags:
      - Health

    responses:
      200:
        description: API is healthy

      400:
        description: Invalid request

      500:
        description: Internal server error
    """
    return jsonify({
        "success": True,
        "data": {
            "status": "healthy"
        },
        "service": "OpenRouter Flask API",
        "model": OPENROUTER_MODEL
    }), 200
