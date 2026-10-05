"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { listCourses, deleteCourse, CourseList, ApiError } from "@/lib/api";

function StatusBadge({ status }: { status: CourseList["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : "bg-neutral-100 text-neutral-500"
      }`}
    >
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}

function EnrollBadge({ type }: { type: CourseList["enrollment_type"] }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        type === "FREE"
          ? "bg-blue-50 text-blue-600"
          : "bg-[#ffde59]/30 text-black"
      }`}
    >
      {type}
    </span>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  function load() {
    setLoading(true);
    listCourses()
      .then(setCourses)
      .catch((e) => setError(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminShell title="Courses">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          {loading ? "Loading…" : `${courses.length} course${courses.length !== 1 ? "s" : ""}`}
        </p>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 bg-[#ffde59] text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#e6c800] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Course
        </Link>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-sm">No courses yet.</p>
          <Link href="/admin/courses/new" className="text-sm text-black underline mt-2 block">
            Create your first course
          </Link>
        </div>
      )}

      {courses.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Start Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-black">{course.title}</div>
                    <div className="text-xs text-neutral-400 font-mono">{course.slug}</div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <EnrollBadge type={course.enrollment_type} />
                    {course.price != null && (
                      <span className="ml-2 text-xs text-neutral-400">
                        ₹{course.price.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-neutral-400 hidden lg:table-cell">
                    {course.start_date
                      ? new Date(course.start_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={deleting === course.id}
                        className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                      >
                        {deleting === course.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
