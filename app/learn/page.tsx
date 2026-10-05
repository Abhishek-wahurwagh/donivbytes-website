import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Understand technology from the ground up. DONIVBYTES learning platform — courses, learning paths, and engineering resources.",
};

const sections = [
  {
    label: "Courses",
    href: "/learn/courses",
    description: "Structured deep-dives into technical topics. Each course builds real understanding from first principles.",
    topics: ["Linux Fundamentals", "Networking", "Docker & Containers", "AWS", "Git Internals"],
  },
  {
    label: "Learning Paths",
    href: "/learn/paths",
    description: "Guided sequences that take you from concept to confident. Follow a path or build your own.",
    topics: ["Cloud Engineering", "Backend Engineering", "DevOps", "Infrastructure"],
  },
  {
    label: "Resources",
    href: "/learn/resources",
    description: "Engineering notes, cheat sheets, reference material, and curated reading — all in one place.",
    topics: ["Command references", "Architecture notes", "Concept explanations", "Reading lists"],
  },
  {
    label: "My Learning",
    href: "/learn/my-learning",
    description: "Track your progress, revisit enrolled courses, and pick up where you left off.",
    topics: ["Progress tracking", "Enrolled courses", "Bookmarks", "History"],
  },
];

const approach = [
  {
    number: "01",
    title: "Concepts first.",
    body: "Before writing a single command, understand what the tool actually does and why it exists.",
  },
  {
    number: "02",
    title: "Build to verify.",
    body: "Every concept gets implemented. If you can build it, you understand it.",
  },
  {
    number: "03",
    title: "Break it deliberately.",
    body: "We push systems to failure on purpose. Failures teach more than happy paths.",
  },
  {
    number: "04",
    title: "Document everything.",
    body: "What we learn gets written down — for ourselves and for everyone who comes after.",
  },
];

export default function LearnPage() {
  return (
    <div className="bg-white pt-28">
      {/* ── Hero ── */}
      <section className="py-20 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-3xl">
            <Badge variant="accent" className="mb-6">
              Learning Platform
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              Learn
              <span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Understand technology from the ground up.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-xl">
              Learn by understanding how things actually work — not by memorizing commands. Every topic on DONIVBYTES is built around real comprehension, practical building, and honest documentation of what breaks.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Sections grid ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16">
            <Badge variant="outline" className="mb-4">
              Explore
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Where do you want to start?
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((section, i) => (
              <AnimatedSection key={section.label} delay={i * 0.08}>
                <Link
                  href={section.href}
                  className="group flex flex-col h-full p-8 rounded-2xl border border-neutral-100 hover:border-[#ffde59] hover:shadow-sm transition-all duration-300 bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black tracking-tight">
                      {section.label}
                    </h3>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="text-neutral-300 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 14L14 4M14 4H6M14 4v8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p className="text-sm text-neutral-500 leading-relaxed mb-6 flex-1">
                    {section.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {section.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 group-hover:bg-[#ffde59]/20 group-hover:text-black transition-colors duration-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approach ── */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16">
            <Badge variant="accent" className="mb-4">
              Our Approach
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Learn by understanding how things actually work.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((item, i) => (
              <AnimatedSection key={item.number} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border border-white/10 hover:border-[#ffde59]/40 transition-colors duration-300 h-full">
                  <span className="text-xs font-mono text-[#ffde59] mb-4 block">
                    {item.number}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
                Ready to start?
              </h2>
              <p className="text-neutral-500">
                Courses go live around October 9. Check back soon.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Button href="/learn/courses" variant="accent">
                View Courses
              </Button>
              <Button href="/experiments" variant="secondary">
                Explore Experiments
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
