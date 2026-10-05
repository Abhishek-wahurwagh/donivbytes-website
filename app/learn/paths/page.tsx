import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Structured learning paths for engineering topics — DONIVBYTES.",
};

const plannedPaths = [
  {
    title: "Cloud Engineering",
    description: "From Linux basics to deploying production infrastructure on AWS.",
    steps: ["Linux", "Networking", "Docker", "AWS Core", "Infrastructure as Code"],
  },
  {
    title: "Backend Engineering",
    description: "Understand how backend systems work from HTTP to databases.",
    steps: ["HTTP & APIs", "Databases", "Auth", "Caching", "System Design"],
  },
  {
    title: "DevOps",
    description: "Learn the practices and tools that bridge development and operations.",
    steps: ["Git", "CI/CD", "Docker", "Kubernetes", "Monitoring"],
  },
  {
    title: "Infrastructure",
    description: "Understand infrastructure from bare metal to cloud-native.",
    steps: ["Linux", "Networking", "IaC", "Cloud", "Security"],
  },
];

export default function PathsPage() {
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
              Learning Paths<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Structured learning paths are coming soon.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
              Learning paths are guided sequences that connect individual courses into a coherent progression. Instead of jumping between random topics, a path takes you from concept to confident in a deliberate order.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-12">
            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
              Paths in planning
            </h2>
            <p className="text-neutral-400 text-sm">
              These paths are being structured alongside the first courses.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plannedPaths.map((path, i) => (
              <AnimatedSection key={path.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border border-neutral-100 bg-white h-full">
                  <h3 className="font-bold text-black mb-2">{path.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">{path.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {path.steps.map((step, idx) => (
                      <span key={step} className="flex items-center gap-1">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">
                          {step}
                        </span>
                        {idx < path.steps.length - 1 && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path
                              d="M2 5h6M6 3l2 2-2 2"
                              stroke="#d1d5db"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
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
                Check out the courses that will make up these paths.
              </p>
              <Button href="/learn/courses" variant="secondary" size="sm">
                View Courses
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
