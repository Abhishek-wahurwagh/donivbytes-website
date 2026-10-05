import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "DONIVBYTES engineering experiments — break things, investigate why, understand deeper. Linux, networking, Docker, AWS, and more.",
};

const areas = [
  {
    label: "Linux",
    items: ["Process scheduling", "File descriptors", "Kernel namespaces", "cgroups", "Signal handling"],
  },
  {
    label: "Networking",
    items: ["DNS resolution", "TCP handshake", "Packet inspection", "Routing tables", "Firewalls"],
  },
  {
    label: "Git",
    items: ["Object model", "Pack files", "Ref storage", "Rebase internals", "Hook system"],
  },
  {
    label: "Docker",
    items: ["Network modes", "Layer caching", "Image internals", "Volume mounts", "BuildKit"],
  },
  {
    label: "AWS",
    items: ["VPC networking", "IAM evaluation", "S3 internals", "Lambda cold starts", "EC2 metadata"],
  },
  {
    label: "Infrastructure",
    items: ["Terraform state", "IaC drift", "Provisioning failures", "Secret management", "Config drift"],
  },
  {
    label: "Backend Systems",
    items: ["Connection pooling", "Query planning", "Cache invalidation", "Rate limiting", "Timeouts"],
  },
  {
    label: "Cloud Architecture",
    items: ["Multi-region failover", "Cost anomalies", "Latency spikes", "Cold start chains", "Noisy neighbours"],
  },
];

const exampleExperiments = [
  {
    title: "Breaking Docker bridge networking",
    summary: "What happens when you exhaust the default bridge network subnet? We found out.",
    area: "Docker",
  },
  {
    title: "DNS TTL vs reality",
    summary: "TTL says 60 seconds. We measured what actually happens across resolvers.",
    area: "Networking",
  },
  {
    title: "Git's object store under load",
    summary: "How git actually stores 10,000 commits and what pack files look like.",
    area: "Git",
  },
  {
    title: "AWS Lambda cold start anatomy",
    summary: "Breaking down exactly where the time goes in a Lambda initialisation.",
    area: "AWS",
  },
];

export default function ExperimentsPage() {
  return (
    <div className="bg-white pt-28">
      {/* ── Hero ── */}
      <section className="py-20 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-3xl">
            <Badge variant="accent" className="mb-6">
              Engineering Experiments
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
              Experiments<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-xl text-neutral-500 leading-relaxed mb-4">
              Break things. Investigate why. Understand deeper.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed max-w-xl">
              DONIVBYTES runs deliberate engineering experiments — we take a technology, push it
              until something breaks, then document exactly what happened and why. The failures are
              the point.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── What this section is for ── */}
      <section className="py-24 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-black tracking-tight mb-6">
                Why experiments?
              </h2>
              <div className="space-y-5 text-neutral-500 text-base leading-relaxed">
                <p>
                  Documentation tells you how a system is designed to work. Experiments show you how it actually behaves — under load, at the edges, when configuration is wrong, when dependencies fail.
                </p>
                <p>
                  Every experiment here follows the same pattern: define a hypothesis, run the test, observe what happens, explain the result. No hand-waving. No skipping the interesting part.
                </p>
                <p>
                  The investigations are documented so they&apos;re useful to anyone who hits the same situation — not just a log of what we did, but a proper explanation of why the system behaved the way it did.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-black rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#ffde59]" />
                  <span className="text-xs font-mono text-white/40 tracking-wide">experiment format</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  {[
                    { label: "Hypothesis", value: "What we expect to happen", color: "text-[#ffde59]" },
                    { label: "Setup", value: "Exact environment & config", color: "text-white/70" },
                    { label: "Test", value: "What we actually ran", color: "text-white/70" },
                    { label: "Observation", value: "What happened", color: "text-white/70" },
                    { label: "Explanation", value: "Why it happened", color: "text-green-400" },
                    { label: "Takeaway", value: "What to remember", color: "text-green-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <span className="text-white/30 w-24 flex-shrink-0">{row.label}</span>
                      <span className={row.color}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Upcoming experiment examples ── */}
      <section className="py-24 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-14">
            <Badge variant="outline" className="mb-4">
              Coming Soon
            </Badge>
            <h2 className="text-3xl font-bold text-black tracking-tight">
              Experiments in preparation
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {exampleExperiments.map((exp, i) => (
              <AnimatedSection key={exp.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border border-neutral-100 bg-white h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-black leading-snug">{exp.title}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#ffde59]/20 text-black flex-shrink-0">
                      {exp.area}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{exp.summary}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Areas ── */}
      <section className="py-24 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-14">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-4">
              Areas we&apos;ll cover
            </h2>
            <p className="text-neutral-500 max-w-xl">
              Experiments will span the full engineering stack — from the Linux kernel up to cloud architecture.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {areas.map((area, i) => (
              <AnimatedSection key={area.label} delay={i * 0.06}>
                <div className="p-5 rounded-2xl border border-neutral-100 bg-white h-full hover:border-neutral-300 transition-colors">
                  <h3 className="font-bold text-black mb-3 text-sm">{area.label}</h3>
                  <ul className="space-y-1.5">
                    {area.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
                Want to learn the underlying concepts first?
              </h2>
              <p className="text-neutral-500">
                The learning section breaks down the fundamentals before we break the systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Button href="/learn" variant="accent">
                Start Learning
              </Button>
              <Button href="/projects" variant="secondary">
                View Projects
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
