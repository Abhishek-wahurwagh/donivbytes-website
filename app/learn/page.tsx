import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PublicCourseGrid from "@/components/learn/PublicCourseGrid";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Understand technology from the ground up. DONIVBYTES learning platform — courses, learning paths, and engineering resources.",
};

const approach = [
  { number: "01", title: "Concepts first.", body: "Before writing a single command, understand what the tool actually does and why it exists." },
  { number: "02", title: "Build to verify.", body: "Every concept gets implemented. If you can build it, you understand it." },
  { number: "03", title: "Break it deliberately.", body: "We push systems to failure on purpose. Failures teach more than happy paths." },
  { number: "04", title: "Document everything.", body: "What we learn gets written down — for ourselves and for everyone who comes after." },
];

export default function LearnPage() {
  return (
    <div className="bg-white pt-28">
      {/* Hero */}
      <section className="py-20 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-3xl">
            <Badge variant="accent" className="mb-6">Learning Platform</Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              Learn<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Understand technology from the ground up.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-xl">
              Learn by understanding how things actually work — not by memorizing commands.
              Every topic on DONIVBYTES is built around real comprehension, practical building,
              and honest documentation of what breaks.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-12">
            <Badge variant="outline" className="mb-4">Courses</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Available now
            </h2>
          </AnimatedSection>
          <PublicCourseGrid />
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16">
            <Badge variant="accent" className="mb-4">Our Approach</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Learn by understanding how things actually work.
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((item, i) => (
              <AnimatedSection key={item.number} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border border-white/10 hover:border-[#ffde59]/40 transition-colors duration-300 h-full">
                  <span className="text-xs font-mono text-[#ffde59] mb-4 block">{item.number}</span>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight mb-2">Ready to start?</h2>
              <p className="text-neutral-500">Create a free account and enroll in your first course.</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Button href="/signup" variant="accent">Create Account</Button>
              <Button href="/experiments" variant="secondary">Explore Experiments</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
