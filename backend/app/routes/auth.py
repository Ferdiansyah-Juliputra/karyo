from flask import Blueprint, request

from app.extensions import db, bcrypt
from app.models.user import User

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth",
)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return {
            "message": "All fields are required."
        }, 400

    existing = User.query.filter_by(email=email).first()

    if existing:
        return {
            "message": "Email already exists."
        }, 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        name=name,
        email=email,
        password_hash=password_hash,
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "Account created successfully."
    }, 201