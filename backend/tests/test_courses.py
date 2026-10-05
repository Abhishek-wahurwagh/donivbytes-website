"""Tests: course CRUD + curriculum CRUD + price validation."""


# ─── Course CRUD ──────────────────────────────────────────────────────────────


def test_create_course(client, auth_headers):
    """Admin can create a course."""
    resp = client.post(
        "/api/v1/admin/courses",
        json={
            "title": "Linux Fundamentals",
            "slug": "linux-fundamentals",
            "enrollment_type": "FREE",
            "status": "DRAFT",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Linux Fundamentals"
    assert data["slug"] == "linux-fundamentals"
    assert data["status"] == "DRAFT"
    assert data["enrollment_type"] == "FREE"
    assert data["price"] is None


def test_list_courses(client, auth_headers):
    """Admin can list courses."""
    client.post(
        "/api/v1/admin/courses",
        json={"title": "Networking", "slug": "networking", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    resp = client.get("/api/v1/admin/courses", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) >= 1


def test_get_course(client, auth_headers):
    """Admin can get a course by ID."""
    create_resp = client.post(
        "/api/v1/admin/courses",
        json={"title": "Docker", "slug": "docker", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    course_id = create_resp.json()["id"]

    resp = client.get(f"/api/v1/admin/courses/{course_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == course_id


def test_update_course(client, auth_headers):
    """Admin can update a course."""
    create_resp = client.post(
        "/api/v1/admin/courses",
        json={"title": "AWS", "slug": "aws-core", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    course_id = create_resp.json()["id"]

    resp = client.patch(
        f"/api/v1/admin/courses/{course_id}",
        json={"status": "PUBLISHED"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "PUBLISHED"


def test_delete_course(client, auth_headers):
    """Admin can delete a course."""
    create_resp = client.post(
        "/api/v1/admin/courses",
        json={"title": "Git", "slug": "git-internals", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    course_id = create_resp.json()["id"]

    resp = client.delete(f"/api/v1/admin/courses/{course_id}", headers=auth_headers)
    assert resp.status_code == 204

    get_resp = client.get(f"/api/v1/admin/courses/{course_id}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_duplicate_slug_rejected(client, auth_headers):
    """Creating two courses with the same slug returns 409."""
    client.post(
        "/api/v1/admin/courses",
        json={"title": "Kubernetes", "slug": "kubernetes", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    resp = client.post(
        "/api/v1/admin/courses",
        json={"title": "Kubernetes 2", "slug": "kubernetes", "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    assert resp.status_code == 409


# ─── Price validation ─────────────────────────────────────────────────────────


def test_free_course_no_price(client, auth_headers):
    """FREE course accepts no price."""
    resp = client.post(
        "/api/v1/admin/courses",
        json={
            "title": "Free Course",
            "slug": "free-course",
            "enrollment_type": "FREE",
            "price": None,
        },
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["price"] is None


def test_paid_course_requires_positive_price(client, auth_headers):
    """PAID course requires a positive price."""
    resp = client.post(
        "/api/v1/admin/courses",
        json={
            "title": "Paid Course",
            "slug": "paid-course-no-price",
            "enrollment_type": "PAID",
            "price": None,
        },
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_paid_course_with_valid_price(client, auth_headers):
    """PAID course with a valid price is accepted."""
    resp = client.post(
        "/api/v1/admin/courses",
        json={
            "title": "Paid Course Valid",
            "slug": "paid-course-valid",
            "enrollment_type": "PAID",
            "price": 999.0,
        },
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["price"] == 999.0


# ─── Curriculum CRUD ──────────────────────────────────────────────────────────


def _create_course(client, auth_headers, slug: str) -> int:
    resp = client.post(
        "/api/v1/admin/courses",
        json={"title": "Test Course", "slug": slug, "enrollment_type": "FREE"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    return resp.json()["id"]


def test_create_chapter(client, auth_headers):
    """Admin can create a chapter in a course."""
    course_id = _create_course(client, auth_headers, "chapter-test-course")
    resp = client.post(
        f"/api/v1/admin/courses/{course_id}/chapters",
        json={"title": "Chapter 1", "position": 0},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["title"] == "Chapter 1"
    assert resp.json()["course_id"] == course_id


def test_create_topic(client, auth_headers):
    """Admin can create a topic inside a chapter."""
    course_id = _create_course(client, auth_headers, "topic-test-course")
    chapter_resp = client.post(
        f"/api/v1/admin/courses/{course_id}/chapters",
        json={"title": "Chapter A", "position": 0},
        headers=auth_headers,
    )
    chapter_id = chapter_resp.json()["id"]

    resp = client.post(
        f"/api/v1/admin/chapters/{chapter_id}/topics",
        json={"title": "Topic 1", "position": 0},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["chapter_id"] == chapter_id


def test_create_subtopic(client, auth_headers):
    """Admin can create a subtopic inside a topic."""
    course_id = _create_course(client, auth_headers, "subtopic-test-course")
    chapter_resp = client.post(
        f"/api/v1/admin/courses/{course_id}/chapters",
        json={"title": "Chapter B", "position": 0},
        headers=auth_headers,
    )
    chapter_id = chapter_resp.json()["id"]

    topic_resp = client.post(
        f"/api/v1/admin/chapters/{chapter_id}/topics",
        json={"title": "Topic B", "position": 0},
        headers=auth_headers,
    )
    topic_id = topic_resp.json()["id"]

    resp = client.post(
        f"/api/v1/admin/topics/{topic_id}/subtopics",
        json={"title": "Subtopic 1", "content": "Some content", "position": 0},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["topic_id"] == topic_id
    assert resp.json()["content"] == "Some content"
