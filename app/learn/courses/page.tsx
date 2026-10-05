import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import PublicCourseGrid from "@/components/learn/PublicCourseGrid";

export const metadata: Metadata = {
  title: "Courses",
  description: "DONIVBYTES engineering courses — structured technical learning from first principles.",
};

export default function CoursesPage() {
  return (
    <div className="bg-white pt-28 min-h-screen">
      <section className="py-20 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-2xl">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-black transition-colors mb-8"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Learn
            </Link>
            <Badge variant="accent" className="mb-6">Courses</Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              Courses<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed">
              Structured technical learning from first principles.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <PublicCourseGrid />
        </div>
      </section>
    </div>
  );
}
