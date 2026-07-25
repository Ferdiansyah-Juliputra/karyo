from io import BytesIO

from app import create_app
from app.schemas.review import ResumeReview


def test_review_is_rate_limited(monkeypatch):
    monkeypatch.setattr(
        "app.routes.review.load_document",
        lambda path: "Python Flask Docker",
    )
    monkeypatch.setattr(
        "app.routes.review.review_resume",
        lambda resume, requirement: ResumeReview(
            ats_score=85,
            summary="Strong Python match.",
            strengths=["Python"],
            missing_skills=["Docker"],
            recommendations=["Add project metrics."],
        ),
    )
    app = create_app({
        "TESTING": True,
        "RATELIMIT_ENABLED": True,
        "RATELIMIT_STORAGE_URI": "memory://",
        "RATELIMIT_DEFAULT": "1000/hour",
        "RATELIMIT_REVIEW_LIMITS": "1/minute",
    })

    with app.test_client() as client:
        first_response = client.post(
            "/review",
            data={
                "resume": (BytesIO(b"dummy pdf"), "resume.pdf"),
                "requirement": "Looking for Python Developer",
            },
            content_type="multipart/form-data",
        )
        second_response = client.post(
            "/review",
            data={
                "resume": (BytesIO(b"dummy pdf"), "resume.pdf"),
                "requirement": "Looking for Python Developer",
            },
            content_type="multipart/form-data",
        )

    assert first_response.status_code == 200
    assert second_response.status_code == 429
    assert second_response.get_json()["success"] is False


def test_health_is_exempt_from_rate_limiting():
    app = create_app({
        "TESTING": True,
        "RATELIMIT_ENABLED": True,
        "RATELIMIT_STORAGE_URI": "memory://",
        "RATELIMIT_DEFAULT": "1/minute",
    })

    with app.test_client() as client:
        assert client.get("/health").status_code == 200
        assert client.get("/health").status_code == 200
