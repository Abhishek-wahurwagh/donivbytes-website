"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import CourseForm, { CourseFormValues } from "@/components/admin/CourseForm";
import CurriculumEditor from "@/components/admin/CurriculumEditor";
import LiveClassEditor from "@/components/admin/LiveClassEditor";
import { getCourse, updateCourse, Course, ApiError } from "@/lib/api";

type Tab = "details" | "curriculum" | "live-classes";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    getCourse(courseId)
      .then(setCourse)
      .catch((e) => setFetchError(e.message ?? "Failed to load course"))
      .finally(() => setLoadingCourse(false));
  }, [courseId]);

  async function handleSubmit(values: CourseFormValues) {
    setSaving(true);
    setFormError(null);
    setSaved(false);
    try {
      const updated = await updateCourse(courseId, {
        title: values.title,
        slug: values.slug,
        short_description: values.short_description || null,
        description: values.description || null,
        difficulty: values.difficulty || null,
        thumbnail_url: values.thumbnail_url || null,
        start_date: values.start_date
          ? new Date(values.start_date).toISOString()
          : null,
        enrollment_type: values.enrollment_type,
        price:
          values.enrollment_type === "PAID" && values.price
            ? parseFloat(values.price)
            : null,
        status: values.status,
      });
      setCourse(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Failed to update course");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: "Course Details" },
    { key: "curriculum", label: "Curriculum" },
    { key: "live-classes", label: "Live Classes" },
  ];

  return (
    <AdminShell title={course ? course.title : "Edit Course"}>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="text-sm text-neutral-400 hover:text-black transition-colors"
        >
          ← Back to courses
        </Link>
        {saved && (
          <span className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1">
            Saved ✓
          </span>
        )}
      </div>

      {fetchError && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {fetchError}
        </div>
      )}

      {loadingCourse && (
        <p className="text-sm text-neutral-400">Loading course…</p>
      )}

      {course && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-neutral-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab.key
                    ? "border-black text-black"
                    : "border-transparent text-neutral-400 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <CourseForm
              initial={course}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              loading={saving}
              error={formError}
            />
          )}

          {activeTab === "curriculum" && (
            <CurriculumEditor courseId={courseId} />
          )}

          {activeTab === "live-classes" && (
            <LiveClassEditor courseId={courseId} />
          )}
        </>
      )}
    </AdminShell>
  );
}
