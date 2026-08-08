from flask import Flask, redirect
from flasgger import Swagger
from flask_cors import CORS

import app.config.config as config

from app.error_handler import register_error_handlers
from app.extensions import limiter, db, bcrypt, jwt

from app.routes.auth import auth_bp
from app.routes.health import health_bp
from app.routes.resume import resume_bp
from app.routes.review import review_bp


def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=config.SQLALCHEMY_DATABASE_URI,
        SQLALCHEMY_TRACK_MODIFICATIONS=config.SQLALCHEMY_TRACK_MODIFICATIONS,

        JWT_SECRET_KEY=config.JWT_SECRET_KEY,
        JWT_TOKEN_LOCATION=config.JWT_TOKEN_LOCATION,
        JWT_ACCESS_COOKIE_NAME=config.JWT_ACCESS_COOKIE_NAME,
        JWT_COOKIE_SECURE=config.JWT_COOKIE_SECURE,
        JWT_COOKIE_CSRF_PROTECT=config.JWT_COOKIE_CSRF_PROTECT,
        JWT_SESSION_COOKIE=config.JWT_SESSION_COOKIE,
        JWT_ACCESS_TOKEN_EXPIRES=config.JWT_ACCESS_TOKEN_EXPIRES,

        RATELIMIT_ENABLED=config.RATELIMIT_ENABLED,
        RATELIMIT_STORAGE_URI=config.RATELIMIT_STORAGE_URI,
        RATELIMIT_DEFAULT=config.RATELIMIT_DEFAULT_LIMITS,
        RATELIMIT_REVIEW_LIMITS=config.RATELIMIT_REVIEW_LIMITS,
        RATELIMIT_STORAGE_OPTIONS={
            "socket_connect_timeout": 2,
            "socket_timeout": 2,
        },
        RATELIMIT_STRATEGY="fixed-window",
        RATELIMIT_HEADERS_ENABLED=True,
    )

    if test_config is not None:
        app.config.update(test_config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    CORS(
        app,
        origins=["http://localhost:3000"],
        supports_credentials=True,
    )

    Swagger(
        app,
        template={
            "swagger": "2.0",
            "info": {
                "title": "AI Resume Reviewer API",
                "description": "REST API for AI-powered resume analysis, ATS scoring, and recommendations.",
                "version": "1.0.0",
            },
        },
    )

    app.register_blueprint(health_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(auth_bp)

    register_error_handlers(app)

    @app.route("/")
    def index():
        return redirect("/health")

    return app