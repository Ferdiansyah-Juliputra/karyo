from flask import Blueprint, request

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    print("METHOD:", request.method)
    return {"message": "ok"}