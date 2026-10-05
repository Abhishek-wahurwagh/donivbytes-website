/**
 * DONIVBYTES API client.
 * All requests go to NEXT_PUBLIC_API_URL — never hard-coded.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Token storage ────────────────────────────────────────────────────────────

const TOKEN_KEY = "donivbytes_admin_token"; // shared key for both admin & student

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  { auth = false, ...init }: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError(401, "Not authenticated");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      detail = res.statusText;
    }
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : res.statusText;
    throw new ApiError(res.status, message, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export type EnrollmentType = "FREE" | "PAID";
export type CourseStatus = "DRAFT" | "PUBLISHED";
export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type UserRole = "admin" | "student";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Admin course types (full, used in admin UI)
export interface Course {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  difficulty: CourseDifficulty | null;
  thumbnail_url: string | null;
  start_date: string | null;
  enrollment_type: EnrollmentType;
  price: number | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface CourseList {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  difficulty: CourseDifficulty | null;
  enrollment_type: EnrollmentType;
  price: number | null;
  status: CourseStatus;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

// Public course types (returned by public endpoints)
export interface PublicCourse {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  thumbnail_url: string | null;
  difficulty: CourseDifficulty | null;
  start_date: string | null;
  enrollment_type: EnrollmentType;
  price: number | null;
}

export interface PublicSubtopic {
  id: number;
  title: string;
  position: number;
}

export interface PublicTopic {
  id: number;
  title: string;
  description: string | null;
  position: number;
  subtopics: PublicSubtopic[];
}

export interface PublicChapter {
  id: number;
  title: string;
  description: string | null;
  position: number;
  topics: PublicTopic[];
}

export interface PublicCourseDetail extends PublicCourse {
  description: string | null;
  chapters: PublicChapter[];
}

// Enrollment types
export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: EnrollmentStatus;
  enrolled_at: string;
}

export interface MyCourse {
  enrollment_id: number;
  status: EnrollmentStatus;
  enrolled_at: string;
  progress: number;
  course: PublicCourse;
}

export interface SubtopicProgress {
  subtopic_id: number;
  completed: boolean;
  completed_at: string | null;
}

export interface ChapterProgress {
  chapter_id: number;
  title: string;
  total_subtopics: number;
  completed_subtopics: number;
}

export interface CourseProgress {
  course_id: number;
  total_subtopics: number;
  completed_subtopics: number;
  percentage: number;
  chapters: ChapterProgress[];
}

// Admin curriculum types
export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  chapter_id: number;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Subtopic {
  id: number;
  topic_id: number;
  title: string;
  content: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string
): Promise<CurrentUser> {
  return request<CurrentUser>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string): Promise<string> {
  const data = await request<{ access_token: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  return data.access_token;
}

export async function getMe(): Promise<CurrentUser> {
  return request<CurrentUser>("/api/v1/auth/me", { auth: true });
}

// ─── Public courses ───────────────────────────────────────────────────────────

export async function getPublicCourses(): Promise<PublicCourse[]> {
  return request<PublicCourse[]>("/api/v1/courses");
}

export async function getPublicCourse(id: number): Promise<PublicCourseDetail> {
  return request<PublicCourseDetail>(`/api/v1/courses/${id}`);
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export async function enrollInCourse(courseId: number): Promise<Enrollment> {
  return request<Enrollment>(`/api/v1/me/courses/${courseId}/enroll`, {
    method: "POST",
    auth: true,
  });
}

export async function getMyCourses(): Promise<MyCourse[]> {
  return request<MyCourse[]>("/api/v1/me/courses", { auth: true });
}

export async function getCourseProgress(courseId: number): Promise<CourseProgress> {
  return request<CourseProgress>(`/api/v1/me/courses/${courseId}/progress`, {
    auth: true,
  });
}

export async function checkCourseAccess(courseId: number): Promise<boolean> {
  try {
    await request<unknown>(`/api/v1/me/courses/${courseId}/content`, { auth: true });
    return true;
  } catch {
    return false;
  }
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function markSubtopicComplete(
  subtopicId: number
): Promise<SubtopicProgress> {
  return request<SubtopicProgress>(`/api/v1/me/subtopics/${subtopicId}/complete`, {
    method: "POST",
    auth: true,
  });
}

export async function unmarkSubtopicComplete(
  subtopicId: number
): Promise<SubtopicProgress> {
  return request<SubtopicProgress>(`/api/v1/me/subtopics/${subtopicId}/complete`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Admin — courses ──────────────────────────────────────────────────────────

export async function listCourses(): Promise<CourseList[]> {
  return request<CourseList[]>("/api/v1/admin/courses", { auth: true });
}

export async function getCourse(id: number): Promise<Course> {
  return request<Course>(`/api/v1/admin/courses/${id}`, { auth: true });
}

export async function createCourse(data: Partial<Course>): Promise<Course> {
  return request<Course>("/api/v1/admin/courses", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function updateCourse(
  id: number,
  data: Partial<Course>
): Promise<Course> {
  return request<Course>(`/api/v1/admin/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function deleteCourse(id: number): Promise<void> {
  return request<void>(`/api/v1/admin/courses/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Admin — chapters ─────────────────────────────────────────────────────────

export async function listChapters(courseId: number): Promise<Chapter[]> {
  return request<Chapter[]>(`/api/v1/admin/courses/${courseId}/chapters`, {
    auth: true,
  });
}

export async function createChapter(
  courseId: number,
  data: { title: string; description?: string; position?: number }
): Promise<Chapter> {
  return request<Chapter>(`/api/v1/admin/courses/${courseId}/chapters`, {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function updateChapter(
  chapterId: number,
  data: Partial<{ title: string; description: string; position: number }>
): Promise<Chapter> {
  return request<Chapter>(`/api/v1/admin/chapters/${chapterId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function deleteChapter(chapterId: number): Promise<void> {
  return request<void>(`/api/v1/admin/chapters/${chapterId}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Admin — topics ───────────────────────────────────────────────────────────

export async function createTopic(
  chapterId: number,
  data: { title: string; description?: string; position?: number }
): Promise<Topic> {
  return request<Topic>(`/api/v1/admin/chapters/${chapterId}/topics`, {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function updateTopic(
  topicId: number,
  data: Partial<{ title: string; description: string; position: number }>
): Promise<Topic> {
  return request<Topic>(`/api/v1/admin/topics/${topicId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function deleteTopic(topicId: number): Promise<void> {
  return request<void>(`/api/v1/admin/topics/${topicId}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Admin — subtopics ────────────────────────────────────────────────────────

export async function createSubtopic(
  topicId: number,
  data: { title: string; content?: string; position?: number }
): Promise<Subtopic> {
  return request<Subtopic>(`/api/v1/admin/topics/${topicId}/subtopics`, {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function updateSubtopic(
  subtopicId: number,
  data: Partial<{ title: string; content: string; position: number }>
): Promise<Subtopic> {
  return request<Subtopic>(`/api/v1/admin/subtopics/${subtopicId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function deleteSubtopic(subtopicId: number): Promise<void> {
  return request<void>(`/api/v1/admin/subtopics/${subtopicId}`, {
    method: "DELETE",
    auth: true,
  });
}
