"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { listCourses, CourseList } from "@/lib/api";

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<CourseList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCourses()
      .then(setCourses)
      .catch((e) => setError(e.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const total = courses.length;
  const published = courses.filter((c) => c.status === "PUBLISHED").length;
  const drafts = courses.filter((c) => c.status === "DRAFT").length;

  const stats = [
    { label: "Total Courses", value: loading ? "—" : String(total) },
    { label: "Published", value: loading ? "—" : String(published) },
    { label: "Drafts", value: loading ? "—" : String(drafts) },
  ];

  return (
    <AdminShell title="Dashboard">
      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-neutral-200 px-6 py-5"
          >
            <div className="text-3xl font-bold text-black mb-1">{s.value}</div>
            <div className="text-sm text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 bg-[#ffde59] text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#e6c800] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New Course
        </Link>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
        >
          View all courses →
        </Link>
      </div>
    </AdminShell>
  );
}
