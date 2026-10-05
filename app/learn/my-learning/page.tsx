import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "My Learning",
  description: "Your enrolled courses and learning progress — DONIVBYTES.",
};

export default function MyLearningPage() {
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
            <Badge variant="outline" className="mb-6">
              Coming Later
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              My Learning<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Your enrolled courses and learning progress will appear here.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
              Once courses are live, this section will let you track your progress, pick up where you left off, and manage your learning. Account functionality will be introduced in a later phase.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-md p-8 rounded-2xl border border-neutral-100 bg-neutral-50">
              <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center mb-4">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M9 2a5 5 0 100 10A5 5 0 009 2zM3.5 16a5.5 5.5 0 0111 0"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-black mb-2">Accounts coming soon</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                Progress tracking and personal learning dashboards will be available once the account system is launched. In the meantime, explore what&apos;s being built.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/learn/courses" variant="accent" size="sm">
                  Browse Courses
                </Button>
                <Button href="/learn/paths" variant="secondary" size="sm">
                  Learning Paths
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
