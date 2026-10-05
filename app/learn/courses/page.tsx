import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Courses",
  description: "DONIVBYTES engineering courses — structured technical learning from first principles.",
};

const upcomingTopics = [
  "Linux Fundamentals",
  "Networking from Scratch",
  "Git Internals",
  "Docker & Containers",
  "AWS Core Services",
  "Backend Engineering",
  "Infrastructure as Code",
  "Cloud Architecture",
];

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
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Learn
            </Link>
            <Badge variant="accent" className="mb-6">
              Coming Soon
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              Courses<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Courses are being prepared.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
              The first batch of courses will go live around October 9. Each course is built around deep technical understanding — not surface-level tutorials.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-12">
            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
              Topics in preparation
            </h2>
            <p className="text-neutral-400 text-sm">
              These are the areas the first courses will cover.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {upcomingTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-sm text-neutral-600 bg-white"
                >
                  {topic}
                </span>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mt-16 pt-12 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-neutral-500 text-sm">
                While you wait, explore the experiments section.
              </p>
              <Button href="/experiments" variant="secondary" size="sm">
                Explore Experiments
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
