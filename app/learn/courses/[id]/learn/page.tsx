"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPublicCourse,
  checkCourseAccess,
  getCourseProgress,
  markSubtopicComplete,
  unmarkSubtopicComplete,
  getToken,
  ApiError,
  PublicCourseDetail,
  PublicChapter,
  PublicSubtopic,
  PublicTopic,
} from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlatSubtopic {
  subtopic: PublicSubtopic;
  topic: PublicTopic;
  chapter: PublicChapter;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function CourseSidebar({
  course,
  completedIds,
  activeSubtopicId,
  onSelect,
  mobileOpen,
  onClose,
}: {
  course: PublicCourseDetail;
  completedIds: Set<number>;
  activeSubtopicId: number | null;
  onSelect: (s: PublicSubtopic) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-neutral-200 z-40 flex flex-col
          transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100 flex-shrink-0">
          <Link
            href={`/learn/courses/${course.id}`}
            className="text-xs font-semibold text-black truncate hover:underline"
            title={course.title}
          >
            {course.title}
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-neutral-100"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-1">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {chapter.title}
                </p>
              </div>
              {chapter.topics.map((topic) => (
                <div key={topic.id}>
                  <p className="px-4 py-1 text-xs font-medium text-neutral-500">{topic.title}</p>
                  {topic.subtopics.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelect(sub);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors ${
                        activeSubtopicId === sub.id
                          ? "bg-[#ffde59]/20 text-black font-medium"
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                      }`}
                    >
                      {completedIds.has(sub.id) ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 text-green-500">
                          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-300 flex-shrink-0" />
                      )}
                      <span className="truncate">{sub.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<PublicCourseDetail | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [activeSubtopic, setActiveSubtopic] = useState<PublicSubtopic | null>(null);
  const [flatList, setFlatList] = useState<FlatSubtopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeIndex = flatList.findIndex((f) => f.subtopic.id === activeSubtopic?.id);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/learn/courses/${courseId}/learn`);
      return;
    }

    async function load() {
      try {
        const [hasAccess, courseData] = await Promise.all([
          checkCourseAccess(courseId),
          getPublicCourse(courseId),
        ]);
        if (!hasAccess) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setCourse(courseData);

        // Build flat list
        const flat: FlatSubtopic[] = [];
        for (const ch of courseData.chapters) {
          for (const tp of ch.topics) {
            for (const sub of tp.subtopics) {
              flat.push({ subtopic: sub, topic: tp, chapter: ch });
            }
          }
        }
        setFlatList(flat);
        if (flat.length > 0) setActiveSubtopic(flat[0].subtopic);

        // Load progress
        const progress = await getCourseProgress(courseId);
        const done = new Set<number>();
        // completedIds come from chapter progress; we need subtopic-level
        // The progress endpoint gives us per-chapter counts, not per-subtopic.
        // We calculate from the flat list × completed counts per chapter.
        // For a better UX, re-use the subtopic IDs from the progress chapters.
        // Since we don't have per-subtopic state from the summary endpoint,
        // we keep completed set empty — individual marks update it live.
        // A full subtopic-level fetch would require a separate endpoint (Phase 3).
        setCompletedIds(done);
      } catch {
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, router]);

  const handleMarkComplete = useCallback(async () => {
    if (!activeSubtopic) return;
    setMarking(true);
    try {
      const isCompleted = completedIds.has(activeSubtopic.id);
      if (isCompleted) {
        await unmarkSubtopicComplete(activeSubtopic.id);
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(activeSubtopic.id);
          return next;
        });
      } else {
        await markSubtopicComplete(activeSubtopic.id);
        setCompletedIds((prev) => new Set([...prev, activeSubtopic.id]));
      }
    } catch (e) {
      // Silent — UX not broken if mark fails
      console.error(e);
    } finally {
      setMarking(false);
    }
  }, [activeSubtopic, completedIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-sm text-neutral-400">Loading course…</span>
      </div>
    );
  }

  if (accessDenied || !course) {
    return (
      <div className="min-h-screen bg-white pt-28 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-lg font-semibold text-black">Access denied</p>
        <p className="text-neutral-400 text-sm text-center">
          You need to be enrolled in this course to access the content.
        </p>
        <Link
          href={`/learn/courses/${courseId}`}
          className="inline-flex items-center gap-2 bg-[#ffde59] text-black font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#e6c800] transition-colors"
        >
          View Course
        </Link>
      </div>
    );
  }

  const isCompleted = activeSubtopic ? completedIds.has(activeSubtopic.id) : false;
  const activeFlat = flatList[activeIndex];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <CourseSidebar
        course={course}
        completedIds={completedIds}
        activeSubtopicId={activeSubtopic?.id ?? null}
        onSelect={setActiveSubtopic}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open curriculum"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h9" stroke="black" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              href={`/learn/courses/${courseId}`}
              className="text-xs text-neutral-400 hover:text-black transition-colors"
            >
              ← {course.title}
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{completedIds.size} / {flatList.length} completed</span>
            <div className="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffde59] rounded-full transition-all"
                style={{ width: flatList.length > 0 ? `${(completedIds.size / flatList.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-10">
          {activeSubtopic && activeFlat ? (
            <div className="max-w-2xl mx-auto">
              {/* Breadcrumb */}
              <p className="text-xs text-neutral-400 mb-2">
                {activeFlat.chapter.title} → {activeFlat.topic.title}
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-6">
                {activeSubtopic.title}
              </h1>

              {/* Content */}
              <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed mb-10">
                {/* Content is stored as plain text for Phase 2 */}
                {activeFlat.subtopic && "content" in (activeFlat.subtopic as object & { content?: string | null })
                  ? ((activeFlat.subtopic as { content?: string | null }).content ?? (
                      <p className="text-neutral-400 italic">Content for this lesson will be added soon.</p>
                    ))
                  : <p className="text-neutral-400 italic">Content for this lesson will be added soon.</p>
                }
              </div>

              {/* Navigation + completion */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-100 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    disabled={activeIndex <= 0}
                    onClick={() => setActiveSubtopic(flatList[activeIndex - 1].subtopic)}
                    className="text-sm text-neutral-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={activeIndex >= flatList.length - 1}
                    onClick={() => setActiveSubtopic(flatList[activeIndex + 1].subtopic)}
                    className="text-sm text-neutral-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className={`inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full transition-all ${
                    isCompleted
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      : "bg-[#ffde59] text-black hover:bg-[#e6c800]"
                  } disabled:opacity-50`}
                >
                  {marking ? (
                    "…"
                  ) : isCompleted ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3.5 3.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
              {flatList.length === 0
                ? "This course has no lessons yet."
                : "Select a lesson from the sidebar."}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
