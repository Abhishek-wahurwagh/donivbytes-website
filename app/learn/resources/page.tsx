import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Resources",
  description: "Engineering notes, references and learning resources — DONIVBYTES.",
};

const resourceTypes = [
  {
    type: "Reference Sheets",
    description: "Quick-reference cards for commands, concepts, and patterns you reach for regularly.",
    examples: ["Linux command reference", "Git cheat sheet", "Docker commands", "AWS CLI reference"],
  },
  {
    type: "Concept Notes",
    description: "Deep written explanations of how specific technologies work at a fundamental level.",
    examples: ["How DNS works", "TCP/IP explained", "Linux process model", "Container internals"],
  },
  {
    type: "Architecture Docs",
    description: "Diagrams and walkthroughs of real system architectures with explanations of tradeoffs.",
    examples: ["Microservices patterns", "Event-driven systems", "Cloud networking", "Storage patterns"],
  },
  {
    type: "Reading Lists",
    description: "Curated books, papers, and articles worth reading for serious engineering depth.",
    examples: ["Systems books", "Networking papers", "Cloud whitepapers", "Engineering blogs"],
  },
];

export default function ResourcesPage() {
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
              Resources<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Engineering notes, references and learning resources will live here.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
              This section will be a growing collection of notes, reference material, and curated resources — written for engineers who want to understand technology deeply, not just use it.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-12">
            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
              What you&apos;ll find here
            </h2>
            <p className="text-neutral-400 text-sm">
              Resources are being written alongside the first courses.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {resourceTypes.map((resource, i) => (
              <AnimatedSection key={resource.type} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border border-neutral-100 bg-white h-full">
                  <h3 className="font-bold text-black mb-2">{resource.type}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-16 pt-12 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-neutral-500 text-sm">
                Explore the experiments section for documented investigations in the meantime.
              </p>
              <Button href="/experiments" variant="secondary" size="sm">
                View Experiments
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
