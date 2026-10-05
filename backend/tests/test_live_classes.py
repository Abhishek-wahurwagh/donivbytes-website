"""
Phase 3 — Live class tests.
"""

from datetime import datetime, timedelta, timezone

import pytest

from app.schemas.course import CourseCreate
from app.schemas.curriculum import ChapterCreate, SubtopicCreate, TopicCreate
from app.services.auth_service import create_admin_user, register_student
from app.services.course_service import (
    create_chapter,
    create_course,
    create_subtopic,
    create_topic,
)
from app.services.enrollment_service import enroll_student


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _utc(offset_hours: int = 2) -> str:
    """ISO datetime string offset_hours from now."""
    return (datetime.now(timezone.utc) + timedelta(hours=offset_hours)).isoformat()


def _live_class_payload(
    title: str = "Intro Session",
    start_offset: int = 1,
    end_offset: int = 2,
    url: str = "https://meet.google.com/abc-defg-hij",
) -> dict:
    return {
        "title": title,
        "start_time": _utc(start_offset),
        "end_time": _utc(end_offset),
        "meet_url": url,
    }


def _make_published_free_course(db, slug: str):
    return create_course(
        db,
        CourseCreate(
            title="Live Test Course",
            slug=slug,
            enrollment_type="FREE",
            status="PUBLISHED",
        ),
    )


def _admin_login(client, db):
    create_admin_user(db, name="Admin", email="lc_admin@test.com", password="admin1234")
    db.commit()
    r = client.post(
        "/api/v1/auth/login",
        json={"email": "lc_admin@test.com", "password": "admin1234"},
    )
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _student_enroll(client, db, email: str, course_id: int) -> dict:
    register_student(db, name="Student", email=email, password="student1234")
    db.commit()
    r = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "student1234"},
    )
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    enroll_student(db, db.query(__import__("app.db.models", fromlist=["User"]).User).filter_by(email=email).first().id, course_id)
    db.commit()
    return headers


# ─── 1. Admin can create a live class ─────────────────────────────────────────


def test_admin_create_live_class(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-create")
    resp = client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=_live_class_payload(),
        headers=admin_h,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Intro Session"
    assert data["meet_url"] == "https://meet.google.com/abc-defg-hij"
    assert data["course_id"] == course.id


# ─── 2. Admin can list live classes ───────────────────────────────────────────


def test_admin_list_live_classes(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-list")
    client.post(f"/api/v1/admin/courses/{course.id}/live-classes", json=_live_class_payload("S1"), headers=admin_h)
    client.post(f"/api/v1/admin/courses/{course.id}/live-classes", json=_live_class_payload("S2", start_offset=3, end_offset=4), headers=admin_h)
    resp = client.get(f"/api/v1/admin/courses/{course.id}/live-classes", headers=admin_h)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


# ─── 3. Admin can update a live class ─────────────────────────────────────────


def test_admin_update_live_class(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-update")
    create_resp = client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=_live_class_payload(),
        headers=admin_h,
    )
    lc_id = create_resp.json()["id"]
    resp = client.patch(
        f"/api/v1/admin/live-classes/{lc_id}",
        json={"title": "Updated Session"},
        headers=admin_h,
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Session"


# ─── 4. Admin can delete a live class ─────────────────────────────────────────


def test_admin_delete_live_class(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-delete")
    create_resp = client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=_live_class_payload(),
        headers=admin_h,
    )
    lc_id = create_resp.json()["id"]
    resp = client.delete(f"/api/v1/admin/live-classes/{lc_id}", headers=admin_h)
    assert resp.status_code == 204
    get_resp = client.get(f"/api/v1/admin/live-classes/{lc_id}", headers=admin_h)
    assert get_resp.status_code == 404


# ─── 5. Invalid end_time is rejected ──────────────────────────────────────────


def test_invalid_end_time_rejected(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-invalid-time")
    payload = _live_class_payload()
    payload["end_time"] = payload["start_time"]  # end == start → invalid
    resp = client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=payload,
        headers=admin_h,
    )
    assert resp.status_code == 422


# ─── 6. Invalid meet_url is rejected ──────────────────────────────────────────


def test_invalid_meet_url_rejected(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-invalid-url")
    payload = _live_class_payload(url="not-a-url")
    resp = client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=payload,
        headers=admin_h,
    )
    assert resp.status_code == 422


# ─── 7. Unauthenticated student cannot access live classes ────────────────────


def test_unauthenticated_cannot_access_live_classes(client, db):
    resp = client.get("/api/v1/me/courses/1/live-classes")
    assert resp.status_code == 403


# ─── 8. Non-enrolled student cannot access live classes ───────────────────────


def test_non_enrolled_student_cannot_access_live_classes(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-non-enrolled")
    client.post(f"/api/v1/admin/courses/{course.id}/live-classes", json=_live_class_payload(), headers=admin_h)

    register_student(db, name="NoEnroll", email="noenroll@test.com", password="pass12345")
    db.commit()
    r = client.post("/api/v1/auth/login", json={"email": "noenroll@test.com", "password": "pass12345"})
    student_h = {"Authorization": f"Bearer {r.json()['access_token']}"}

    resp = client.get(f"/api/v1/me/courses/{course.id}/live-classes", headers=student_h)
    assert resp.status_code == 403


# ─── 9. Enrolled student can access live classes and meet_url ─────────────────


def test_enrolled_student_can_access_live_classes_and_meet_url(client, db):
    admin_h = _admin_login(client, db)
    course = _make_published_free_course(db, "lc-enrolled")
    client.post(
        f"/api/v1/admin/courses/{course.id}/live-classes",
        json=_live_class_payload(url="https://meet.google.com/xyz-1234-abc"),
        headers=admin_h,
    )

    student_h = _student_enroll(client, db, "enrolled_lc@test.com", course.id)
    resp = client.get(f"/api/v1/me/courses/{course.id}/live-classes", headers=student_h)
    assert resp.status_code == 200
    classes = resp.json()
    assert len(classes) == 1
    assert classes[0]["meet_url"] == "https://meet.google.com/xyz-1234-abc"
