from flask import Flask, render_template
from flasgger import Swagger
from flask_cors import CORS

from app.config.config import (
    RATELIMIT_DEFAULT_LIMITS,
    RATELIMIT_ENABLED,
    RATELIMIT_REVIEW_LIMITS,
    RATELIMIT_STORAGE_URI,
)
from app.error_handler import register_error_handlers
from app.extensions import limiter
from app.routes.health import health_bp
from app.routes.resume import resume_bp
from app.routes.review import review_bp


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(
        app,
        resources={
            r"/*":{
                "origins":[
                    "http://localhost:3000"
                ]
            }
        }
    )
    app.config.from_mapping(
        RATELIMIT_ENABLED=RATELIMIT_ENABLED,
        RATELIMIT_STORAGE_URI=RATELIMIT_STORAGE_URI,
        RATELIMIT_DEFAULT=RATELIMIT_DEFAULT_LIMITS,
        RATELIMIT_REVIEW_LIMITS=RATELIMIT_REVIEW_LIMITS,
        RATELIMIT_STORAGE_OPTIONS={
            "socket_connect_timeout": 2,
            "socket_timeout": 2,
        },
        RATELIMIT_STRATEGY="fixed-window",
        RATELIMIT_HEADERS_ENABLED=True,
    )

    if test_config is not None:
        app.config.update(test_config)

    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "AI Resume Reviewer API",
            "description": "REST API for AI-powered resume analysis, ATS scoring, and recommendations.",
            "version": "1.0.0"
        }
    }

    limiter.init_app(app)

    Swagger(app, template=swagger_template)

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(review_bp)

    register_error_handlers(app)

    @app.route("/")
    def index():
        return render_template("index.html")

    return app
