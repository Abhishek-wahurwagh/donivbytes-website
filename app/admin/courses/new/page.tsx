"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import CourseForm, { CourseFormValues } from "@/components/admin/CourseForm";
import { createCourse, ApiError } from "@/lib/api";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: CourseFormValues) {
    setLoading(true);
    setError(null);
    try {
      const course = await createCourse({
        title: values.title,
        slug: values.slug,
        short_description: values.short_description || undefined,
        description: values.description || undefined,
        difficulty: values.difficulty || undefined,
        thumbnail_url: values.thumbnail_url || undefined,
        start_date: values.start_date
          ? new Date(values.start_date).toISOString()
          : undefined,
        enrollment_type: values.enrollment_type,
        price:
          values.enrollment_type === "PAID" && values.price
            ? parseFloat(values.price)
            : undefined,
        status: values.status,
      });
      router.push(`/admin/courses/${course.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="New Course">
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="text-sm text-neutral-400 hover:text-black transition-colors"
        >
          ← Back to courses
        </Link>
      </div>
      <CourseForm
        onSubmit={handleSubmit}
        submitLabel="Create Course"
        loading={loading}
        error={error}
      />
    </AdminShell>
  );
}
