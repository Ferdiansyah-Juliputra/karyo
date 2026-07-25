from io import BytesIO

def test_upload_resume(client, monkeypatch):

    monkeypatch.setattr(
        "app.routes.resume.load_document",
        lambda path: "Resume Content"
    )

    response = client.post(
        "/resume",
        data={
            "file": (
                BytesIO(b"dummy"),
                "resume.pdf"
            )
        },
        content_type="multipart/form-data"
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["success"] is True

def test_upload_resume_without_file(client):
    response = client.post("/resume")

    assert response.status_code == 400