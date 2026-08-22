from io import BytesIO

from app import create_app


def test_review_is_rate_limited(monkeypatch):
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": (
            "postgresql+psycopg2://postgres:postgres"
            "@localhost:5433/karyo_test"
        ),
        "RATELIMIT_ENABLED": True,
        "RATELIMIT_STORAGE_URI": "memory://",
        "RATELIMIT_DEFAULT": "1000/hour",
        "RATELIMIT_REVIEW_LIMITS": "1/minute",
    })

    # create schema for this dedicated test app
    from app.extensions import db, bcrypt
    from app.models.user import User
    from flask_jwt_extended import create_access_token

    with app.app_context():
        db.create_all()

        user = User(
            name="Rate Limit User",
            email="rate-limit-test@example.com",
            password_hash=bcrypt.generate_password_hash(
                "password"
            ).decode("utf-8"),
        )

        db.session.add(user)
        db.session.commit()

        token = create_access_token(
            identity=str(user.id)
        )

    monkeypatch.setattr(
        "app.routes.review.executor.submit",
        lambda *args, **kwargs: None,
    )

    with app.test_client() as client:
        client.set_cookie(
            "access_token",
            token,
        )

        first_response = client.post(
            "/review",
            data={
                "resume": (
                    BytesIO(b"dummy pdf"),
                    "resume.pdf",
                ),
                "requirement": "Looking for Python Developer",
            },
            content_type="multipart/form-data",
        )

        second_response = client.post(
            "/review",
            data={
                "resume": (
                    BytesIO(b"dummy pdf"),
                    "resume.pdf",
                ),
                "requirement": "Looking for Python Developer",
            },
            content_type="multipart/form-data",
        )

    assert first_response.status_code == 202
    assert second_response.status_code == 429
    assert second_response.get_json()["success"] is False

    with app.app_context():
        db.drop_all()