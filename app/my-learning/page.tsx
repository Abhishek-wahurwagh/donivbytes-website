"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyCourses, getToken, clearToken, getMe, MyCourse, CurrentUser } from "@/lib/api";
import AnimatedSection from "@/components/ui/AnimatedSection";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#ffde59] rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function MyLearningPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login?next=/my-learning");
      return;
    }
    Promise.all([getMe(), getMyCourses()])
      .then(([u, list]) => {
        setUser(u);
        setCourses(list);
      })
      .catch(() => {
        clearToken();
        router.replace("/login?next=/my-learning");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <span className="text-sm text-neutral-400">Loading…</span>
      </div>
    );
  }

  return (
    <div className="bg-white pt-28 min-h-screen">
      <section className="py-16 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Welcome back</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
                  {user?.name ?? "My Learning"}
                </h1>
              </div>
              <button
                onClick={() => {
                  clearToken();
                  router.push("/");
                }}
                className="text-sm text-neutral-400 hover:text-black transition-colors"
              >
                Sign out
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {courses.length === 0 ? (
            <AnimatedSection className="text-center py-20">
              <p className="text-lg font-medium text-black mb-2">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <p className="text-neutral-400 text-sm mb-8">
                Browse available courses and start learning today.
              </p>
              <Link
                href="/learn/courses"
                className="inline-flex items-center gap-2 bg-[#ffde59] text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#e6c800] transition-colors"
              >
                Explore Courses
              </Link>
            </AnimatedSection>
          ) : (
            <>
              <AnimatedSection className="mb-8">
                <h2 className="text-xl font-bold text-black tracking-tight">
                  {courses.length} enrolled course{courses.length !== 1 ? "s" : ""}
                </h2>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((mc, i) => (
                  <AnimatedSection key={mc.enrollment_id} delay={i * 0.07}>
                    <div className="flex flex-col h-full bg-white rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 p-5">
                      {/* Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            mc.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : mc.status === "COMPLETED"
                              ? "bg-[#ffde59]/30 text-black"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {mc.status}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {mc.course.enrollment_type === "FREE" ? "Free" : "Paid"}
                        </span>
                      </div>

                      <h3 className="font-bold text-black leading-snug mb-1 flex-1">
                        {mc.course.title}
                      </h3>

                      {mc.course.start_date && (
                        <p className="text-xs text-neutral-400 mb-4">
                          Started{" "}
                          {new Date(mc.enrolled_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-neutral-400">Progress</span>
                          <span className="text-xs font-semibold text-black">
                            {mc.progress}%
                          </span>
                        </div>
                        <ProgressBar value={mc.progress} />
                      </div>

                      <Link
                        href={`/learn/courses/${mc.course.id}/learn`}
                        className="block w-full text-center bg-black text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.2} className="mt-10">
                <Link
                  href="/learn/courses"
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
                >
                  Browse more courses →
                </Link>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
