from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth",
)


@auth_bp.post("/register")
def register():
    return register_user(request.get_json())

@auth_bp.post("/login")
def login():

    try:
        user = login_user(request.get_json())

        token = create_access_token(
            identity=str(user.id)
        )

        response = jsonify({
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            },
        })

        set_access_cookies(
            response,
            token,
        )

        return response

    except ValueError as e:

        return {
            "success": False,
            "message": str(e),
        }, 401