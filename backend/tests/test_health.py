from unittest.mock import patch

@patch("app.routes.health.health")
def test_health(mock_check_health, client):
    mock_check_health.return_value = {"status": "healthy"}

    response = client.get("/health")

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["status"] == "healthy"