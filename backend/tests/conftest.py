import pytest

from app import create_app
from app.extensions import db
from app.extensions import bcrypt
from app.models.user import User
from flask_jwt_extended import create_access_token


TEST_DATABASE_URL = (
    "postgresql+psycopg2://postgres:postgres"
    "@localhost:5433/karyo_test"
)


@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": TEST_DATABASE_URL,
        "RATELIMIT_ENABLED": False,
    })

    with app.app_context():
        db.drop_all()
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def auth_client(app):
    with app.app_context():
        user = User(
            name="Test User",
            email="test@example.com",
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

        yield client


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client