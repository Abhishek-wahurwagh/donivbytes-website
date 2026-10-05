"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPublicCourse,
  enrollInCourse,
  getMyCourses,
  getToken,
  ApiError,
  PublicCourseDetail,
  MyCourse,
} from "@/lib/api";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

function DifficultyBadge({ d }: { d: string | null }) {
  if (!d) return null;
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 capitalize">
      {d.charAt(0) + d.slice(1).toLowerCase()}
    </span>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<PublicCourseDetail | null>(null);
  const [enrollment, setEnrollment] = useState<MyCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [courseData, myList] = await Promise.allSettled([
          getPublicCourse(courseId),
          getToken() ? getMyCourses() : Promise.resolve([]),
        ]);
        if (courseData.status === "rejected") {
          setFetchError("Course not found or not available.");
          setLoading(false);
          return;
        }
        setCourse(courseData.value);
        if (myList.status === "fulfilled") {
          const found = myList.value.find((mc) => mc.course.id === courseId);
          setEnrollment(found ?? null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  async function handleEnroll() {
    if (!getToken()) {
      router.push(`/login?next=/learn/courses/${courseId}`);
      return;
    }
    setEnrolling(true);
    setError(null);
    try {
      await enrollInCourse(courseId);
      // Refresh enrollment state
      const myList = await getMyCourses();
      const found = myList.find((mc) => mc.course.id === courseId);
      setEnrollment(found ?? null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <span className="text-sm text-neutral-400">Loading…</span>
      </div>
    );
  }

  if (fetchError || !course) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-neutral-500">{fetchError ?? "Course not found."}</p>
          <Link href="/learn/courses" className="text-sm text-black underline mt-4 block">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = course.enrollment_type === "PAID";

  return (
    <div className="bg-white pt-28 min-h-screen">
      {/* Header */}
      <section className="py-16 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-black transition-colors mb-8"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left — course info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="flex flex-wrap gap-2 mb-4">
                  <DifficultyBadge d={course.difficulty} />
                  <Badge variant={course.enrollment_type === "FREE" ? "outline" : "accent"}>
                    {course.enrollment_type === "FREE"
                      ? "Free"
                      : course.price
                      ? `₹${course.price.toLocaleString()}`
                      : "Paid"}
                  </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-black tracking-tight leading-tight mb-4">
                  {course.title}
                </h1>

                {course.short_description && (
                  <p className="text-lg text-neutral-500 leading-relaxed mb-4">
                    {course.short_description}
                  </p>
                )}

                {course.description && (
                  <p className="text-base text-neutral-400 leading-relaxed whitespace-pre-line">
                    {course.description}
                  </p>
                )}

                {course.start_date && (
                  <p className="text-sm text-neutral-400 mt-4">
                    Starts{" "}
                    {new Date(course.start_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </AnimatedSection>
            </div>

            {/* Right — enroll card */}
            <AnimatedSection direction="left" delay={0.1}>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sticky top-28">
                {isPaid && course.price && (
                  <div className="text-3xl font-bold text-black mb-4">
                    ₹{course.price.toLocaleString()}
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                    {error}
                  </p>
                )}

                {enrollment ? (
                  <Link
                    href={`/learn/courses/${courseId}/learn`}
                    className="block w-full text-center bg-black text-white font-semibold text-sm py-3 rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Continue Learning
                  </Link>
                ) : isPaid ? (
                  <div>
                    <button
                      disabled
                      className="block w-full text-center bg-neutral-200 text-neutral-400 font-semibold text-sm py-3 rounded-xl cursor-not-allowed"
                    >
                      Payment coming soon
                    </button>
                    <p className="text-xs text-neutral-400 text-center mt-2">
                      Paid enrollment is not yet available.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-[#ffde59] text-black font-semibold text-sm py-3 rounded-xl hover:bg-[#e6c800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling
                      ? "Enrolling…"
                      : getToken()
                      ? "Enroll Now — Free"
                      : "Sign in to Enroll"}
                  </button>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      {course.chapters.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection className="mb-10">
              <h2 className="text-2xl font-bold text-black tracking-tight">Course Curriculum</h2>
              <p className="text-sm text-neutral-400 mt-1">
                {course.chapters.length} chapter
                {course.chapters.length !== 1 ? "s" : ""}
              </p>
            </AnimatedSection>

            <div className="space-y-3 max-w-2xl">
              {course.chapters.map((chapter, ci) => (
                <AnimatedSection key={chapter.id} delay={ci * 0.05}>
                  <details className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-300">
                          {String(ci + 1).padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-black text-sm">{chapter.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400">
                          {chapter.topics.reduce((a, t) => a + t.subtopics.length, 0)} lessons
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="transition-transform group-open:rotate-180 text-neutral-400"
                          aria-hidden="true"
                        >
                          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </summary>

                    <div className="px-5 pb-4 space-y-3 border-t border-neutral-100">
                      {chapter.topics.map((topic) => (
                        <div key={topic.id} className="pt-3">
                          <p className="text-sm font-medium text-black mb-2">{topic.title}</p>
                          <ul className="space-y-1.5 ml-3">
                            {topic.subtopics.map((sub) => (
                              <li key={sub.id} className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />
                                {sub.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
