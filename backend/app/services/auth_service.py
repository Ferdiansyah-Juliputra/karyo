from app.extensions import db, bcrypt
from app.models.user import User


def register_user(data):
    """
    Register a new user.
    """

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return {
            "success": False,
            "message": "All fields are required."
        }, 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return {
            "success": False,
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
        "success": True,
        "message": "Account created successfully."
    }, 201


def login_user(data):

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        raise ValueError("Email and password are required.")

    user = User.query.filter_by(email=email).first()

    if not user:
        raise ValueError("Invalid email or password.")

    if not bcrypt.check_password_hash(
        user.password_hash,
        password,
    ):
        raise ValueError("Invalid email or password.")

    return user