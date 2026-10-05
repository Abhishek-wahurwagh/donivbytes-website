"""
Phase 2 tests — student auth, public courses, enrollment, progress.
All 14 required test cases.
"""

import pytest
from app.services.auth_service import create_admin_user, register_student
from app.services.course_service import create_course, create_chapter, create_topic, create_subtopic
from app.schemas.course import CourseCreate
from app.schemas.curriculum import ChapterCreate, TopicCreate, SubtopicCreate
from app.db.models import CourseStatus


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _register(client, email="student@test.com", password="pass1234"):
    return client.post(
        "/api/v1/auth/register",
        json={"name": "Test Student", "email": email, "password": password},
    )


def _login(client, email="student@test.com", password="pass1234"):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def _student_headers(client, email="student@test.com", password="pass1234"):
    _register(client, email, password)
    token = _login(client, email, password)
    return {"Authorization": f"Bearer {token}"}


def _make_published_free_course(db, slug="test-pub-free"):
    course = create_course(
        db,
        CourseCreate(
            title="Published Free Course",
            slug=slug,
            enrollment_type="FREE",
            status="PUBLISHED",
        ),
    )
    return course


def _make_published_paid_course(db, slug="test-pub-paid"):
    return create_course(
        db,
        CourseCreate(
            title="Published Paid Course",
            slug=slug,
            enrollment_type="PAID",
            price=999.0,
            status="PUBLISHED",
        ),
    )


def _make_draft_course(db, slug="test-draft"):
    return create_course(
        db,
        CourseCreate(title="Draft Course", slug=slug, enrollment_type="FREE", status="DRAFT"),
    )


# ─── 1. Student registration ──────────────────────────────────────────────────


def test_student_registration(client):
    resp = _register(client)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "student@test.com"
    assert data["role"] == "student"
    assert "password" not in data
    assert "password_hash" not in data


# ─── 2. Duplicate email registration ─────────────────────────────────────────


def test_duplicate_email_registration(client):
    _register(client)
    resp = _register(client)
    assert resp.status_code == 409


# ─── 3. Student login ─────────────────────────────────────────────────────────


def test_student_login(client):
    _register(client, "logintest@test.com")
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "logintest@test.com", "password": "pass1234"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


# ─── 4. /auth/me ──────────────────────────────────────────────────────────────


def test_auth_me(client):
    headers = _student_headers(client, "me@test.com")
    resp = client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "me@test.com"
    assert data["role"] == "student"


# ─── 5. Public course listing ─────────────────────────────────────────────────


def test_public_course_listing(client, db):
    _make_published_free_course(db, slug="pub-list-1")
    _make_draft_course(db, slug="draft-list-1")
    resp = client.get("/api/v1/courses")
    assert resp.status_code == 200
    slugs = [c["slug"] for c in resp.json()]
    assert "pub-list-1" in slugs
    assert "draft-list-1" not in slugs  # drafts never exposed


# ─── 6. Public course detail ──────────────────────────────────────────────────


def test_public_course_detail(client, db):
    course = _make_published_free_course(db, slug="pub-detail")
    chapter = create_chapter(db, course.id, ChapterCreate(title="Ch1", position=0))
    topic = create_topic(db, chapter.id, TopicCreate(title="T1", position=0))
    create_subtopic(db, topic.id, SubtopicCreate(title="S1", position=0))

    resp = client.get(f"/api/v1/courses/{course.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["slug"] == "pub-detail"
    assert len(data["chapters"]) == 1
    assert len(data["chapters"][0]["topics"]) == 1
    assert len(data["chapters"][0]["topics"][0]["subtopics"]) == 1


def test_public_course_detail_draft_not_found(client, db):
    draft = _make_draft_course(db, slug="hidden-draft")
    resp = client.get(f"/api/v1/courses/{draft.id}")
    assert resp.status_code == 404


# ─── 7. Student can enroll in FREE course ─────────────────────────────────────


def test_student_enroll_free(client, db):
    headers = _student_headers(client, "enroll1@test.com")
    course = _make_published_free_course(db, slug="enroll-free-1")
    resp = client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "ACTIVE"
    assert data["course_id"] == course.id


# ─── 8. Student cannot enroll twice ───────────────────────────────────────────


def test_student_cannot_enroll_twice(client, db):
    headers = _student_headers(client, "enroll2@test.com")
    course = _make_published_free_course(db, slug="enroll-twice")
    client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    resp = client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    assert resp.status_code == 409


# ─── 9. Student cannot enroll in PAID course ─────────────────────────────────


def test_student_cannot_enroll_paid(client, db):
    headers = _student_headers(client, "enroll3@test.com")
    course = _make_published_paid_course(db, slug="enroll-paid")
    resp = client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    assert resp.status_code == 402


# ─── 10. Unauthenticated user cannot access learning content ─────────────────


def test_unauthenticated_cannot_access_content(client, db):
    course = _make_published_free_course(db, slug="content-auth-test")
    resp = client.get(f"/api/v1/me/courses/{course.id}/content")
    # HTTPBearer returns 403 when Authorization header is absent
    assert resp.status_code == 403


# ─── 11. Enrolled student can access learning content ────────────────────────


def test_enrolled_student_can_access_content(client, db):
    headers = _student_headers(client, "content1@test.com")
    course = _make_published_free_course(db, slug="content-access")
    client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    resp = client.get(f"/api/v1/me/courses/{course.id}/content", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["access"] is True


# ─── 12. Student can mark a subtopic complete ────────────────────────────────


def test_mark_subtopic_complete(client, db):
    headers = _student_headers(client, "progress1@test.com")
    course = _make_published_free_course(db, slug="mark-complete")
    chapter = create_chapter(db, course.id, ChapterCreate(title="Ch", position=0))
    topic = create_topic(db, chapter.id, TopicCreate(title="T", position=0))
    subtopic = create_subtopic(db, topic.id, SubtopicCreate(title="S", position=0))

    client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    resp = client.post(f"/api/v1/me/subtopics/{subtopic.id}/complete", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["completed"] is True


# ─── 13. Student can unmark a subtopic ───────────────────────────────────────


def test_unmark_subtopic_complete(client, db):
    headers = _student_headers(client, "progress2@test.com")
    course = _make_published_free_course(db, slug="unmark-complete")
    chapter = create_chapter(db, course.id, ChapterCreate(title="Ch", position=0))
    topic = create_topic(db, chapter.id, TopicCreate(title="T", position=0))
    subtopic = create_subtopic(db, topic.id, SubtopicCreate(title="S", position=0))

    client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    client.post(f"/api/v1/me/subtopics/{subtopic.id}/complete", headers=headers)
    resp = client.delete(f"/api/v1/me/subtopics/{subtopic.id}/complete", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["completed"] is False


# ─── 14. Course progress calculation ─────────────────────────────────────────


def test_course_progress_calculation(client, db):
    headers = _student_headers(client, "progress3@test.com")
    course = _make_published_free_course(db, slug="progress-calc")
    chapter = create_chapter(db, course.id, ChapterCreate(title="Ch", position=0))
    topic = create_topic(db, chapter.id, TopicCreate(title="T", position=0))
    s1 = create_subtopic(db, topic.id, SubtopicCreate(title="S1", position=0))
    s2 = create_subtopic(db, topic.id, SubtopicCreate(title="S2", position=1))
    s3 = create_subtopic(db, topic.id, SubtopicCreate(title="S3", position=2))

    client.post(f"/api/v1/me/courses/{course.id}/enroll", headers=headers)
    client.post(f"/api/v1/me/subtopics/{s1.id}/complete", headers=headers)
    client.post(f"/api/v1/me/subtopics/{s2.id}/complete", headers=headers)

    resp = client.get(f"/api/v1/me/courses/{course.id}/progress", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_subtopics"] == 3
    assert data["completed_subtopics"] == 2
    assert abs(data["percentage"] - 66.7) < 0.1
