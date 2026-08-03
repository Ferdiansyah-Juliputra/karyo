from flask import Blueprint, request

from app.services.auth_service import (register_user, login_user)

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
    return login_user(request.get_json())