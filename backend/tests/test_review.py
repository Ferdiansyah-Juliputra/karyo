from io import BytesIO

from app.extensions import db, bcrypt
from app.models.user import User


def create_authenticated_client(app):
    from flask_jwt_extended import create_access_token

    with app.app_context():
        user = User(
            name="Test User",
            email="review-test@example.com",
            password_hash=bcrypt.generate_password_hash(
                "password"
            ).decode("utf-8"),
        )

        db.session.add(user)
        db.session.commit()

        token = create_access_token(
            identity=str(user.id)
        )

    client = app.test_client()

    client.set_cookie(
        "access_token",
        token,
    )

    return client, user.id


def test_review_success(client, monkeypatch):
    app = client.application

    auth_client, user_id = create_authenticated_client(app)

    monkeypatch.setattr(
        "app.routes.review.executor.submit",
        lambda *args, **kwargs: None,
    )

    data = {
        "resume": (
            BytesIO(b"dummy pdf"),
            "resume.pdf",
        ),
        "requirement": "Looking for Python Developer",
    }

    response = auth_client.post(
        "/review",
        data=data,
        content_type="multipart/form-data",
    )

    assert response.status_code == 202

    body = response.get_json()

    assert body["success"] is True
    assert body["status"] == "queued"
    assert body["review_id"]

    with app.app_context():
        db.session.query(User).filter_by(
            id=user_id
        ).delete()

        db.session.commit()


def test_review_without_requirement(client):
    app = client.application

    auth_client, user_id = create_authenticated_client(app)

    response = auth_client.post(
        "/review",
        data={
            "resume": (
                BytesIO(b"dummy"),
                "resume.pdf",
            )
        },
        content_type="multipart/form-data",
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["success"] is False

    with app.app_context():
        db.session.query(User).filter_by(
            id=user_id
        ).delete()

        db.session.commit()