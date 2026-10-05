"""Tests: admin authentication."""

from app.services.auth_service import create_admin_user


def test_login_success(client, db):
    """Admin login succeeds with correct credentials."""
    create_admin_user(db, name="Alice", email="alice@example.com", password="password123")
    db.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "alice@example.com", "password": "password123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, db):
    """Admin login fails with incorrect password."""
    create_admin_user(db, name="Bob", email="bob@example.com", password="correct123")
    db.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "bob@example.com", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_login_unknown_email(client):
    """Admin login fails with an email that doesn't exist."""
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "anything"},
    )
    assert resp.status_code == 401


def test_protected_endpoint_rejects_unauthenticated(client):
    """Protected course endpoint rejects requests without a token."""
    resp = client.get("/api/v1/admin/courses")
    assert resp.status_code == 403


def test_protected_endpoint_rejects_invalid_token(client):
    """Protected course endpoint rejects an invalid JWT."""
    resp = client.get(
        "/api/v1/admin/courses",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert resp.status_code == 401
