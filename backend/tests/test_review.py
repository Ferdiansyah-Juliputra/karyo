from io import BytesIO

from app.schemas.review import ResumeReview


def test_review_success(client, monkeypatch):
    monkeypatch.setattr(
        "app.routes.review.review_resume",
        lambda resume, requirement: ResumeReview(
            ats_score=85,
            summary="Strong Python match.",
            strengths=["Python"],
            missing_skills=["Docker"],
            recommendations=["Add project metrics."],
        )
    )

    monkeypatch.setattr(
        "app.routes.review.load_document",
        lambda path: "Python Flask Docker"
    )

    data = {
        "resume": (
            BytesIO(b"dummy pdf"),
            "resume.pdf"
        ),
        "requirement": "Looking for Python Developer"
    }

    response = client.post(
        "/review",
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["success"] is True
    assert body["data"]["ats_score"] == 85
    assert body["data"]["strengths"] == ["Python"]


def test_review_without_requirement(client):
    response = client.post(
        "/review",
        data={
            "resume": (
                BytesIO(b"dummy"),
                "resume.pdf"
            )
        },
        content_type="multipart/form-data"
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["success"] is False
