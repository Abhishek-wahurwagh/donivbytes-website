"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

// ─── Three Pillars ────────────────────────────────────────────────────────────

const pillars = [
  {
    label: "Learn",
    headline: "Understand how technology actually works.",
    description:
      "Not surface-level tutorials. We go deep — from how the Linux kernel schedules processes to how DNS actually resolves a name. Real understanding, not memorized commands.",
    examples: ["Linux", "Networking", "Git", "Cloud Computing", "AWS", "Docker", "Backend Engineering"],
    cta: { label: "Explore Learning", href: "/learn" },
    accent: true,
  },
  {
    label: "Build",
    headline: "Turn concepts into working systems.",
    description:
      "Learning means nothing without building. We apply what we understand to real projects — from infrastructure tooling to cloud platforms and backend systems.",
    examples: ["CloudMateFusion", "OneClickGit", "Infrastructure projects", "Backend projects"],
    cta: { label: "View Projects", href: "/projects" },
    accent: false,
  },
  {
    label: "Explore",
    headline: "Experiment, break systems, investigate failures.",
    description:
      "The most valuable knowledge comes from breaking things deliberately. We run experiments, document what breaks, understand why, and share the findings.",
    examples: ["Docker networking", "AWS experiments", "Linux internals", "Cloud architecture"],
    cta: { label: "Explore Experiments", href: "/experiments" },
    accent: false,
  },
];

// ─── Philosophy Steps ─────────────────────────────────────────────────────────

const philosophySteps = [
  { step: "Understand", sub: "Learn the concept deeply" },
  { step: "Build", sub: "Implement it from scratch" },
  { step: "Break", sub: "Push it until it fails" },
  { step: "Investigate", sub: "Find out exactly why" },
  { step: "Fix", sub: "Resolve and document it" },
  { step: "Understand Deeper", sub: "Knowledge compounds", accent: true },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 text-neutral-300"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 text-neutral-300"
      aria-hidden="true"
    >
      <path
        d="M7 2v10M3 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Overview() {
  return (
    <>
      {/* ── Three Pillars ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-2xl mb-20">
            <Badge variant="outline" className="mb-6">
              What We Do
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-black leading-tight tracking-tight mb-6">
              Learn. Build.{" "}
              <span className="relative inline-block">
                Explore
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffde59] rounded-full" />
              </span>
              .
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              DONIVBYTES is an engineering learning and experimentation platform. We break down complex technical concepts, build real systems, and document what happens when things go wrong.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={pillar.label} delay={i * 0.1}>
                <div
                  className={`group flex flex-col h-full p-8 rounded-2xl border transition-all duration-300 ${
                    pillar.accent
                      ? "bg-[#ffde59] border-[#ffde59] hover:shadow-md"
                      : "bg-white border-neutral-100 hover:border-neutral-300 hover:shadow-sm"
                  }`}
                >
                  <div className="mb-6">
                    <span
                      className={`text-xs font-semibold tracking-widest uppercase ${
                        pillar.accent ? "text-black/50" : "text-neutral-400"
                      }`}
                    >
                      {pillar.label}
                    </span>
                    <h3
                      className={`mt-2 text-xl font-bold leading-snug tracking-tight ${
                        pillar.accent ? "text-black" : "text-black"
                      }`}
                    >
                      {pillar.headline}
                    </h3>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-6 flex-1 ${
                      pillar.accent ? "text-black/70" : "text-neutral-500"
                    }`}
                  >
                    {pillar.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {pillar.examples.map((ex) => (
                      <span
                        key={ex}
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          pillar.accent
                            ? "bg-black/10 text-black/70"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={pillar.cta.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      pillar.accent
                        ? "text-black hover:text-black/70"
                        : "text-black hover:text-neutral-600"
                    }`}
                  >
                    {pillar.cta.label}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2 7h10M7 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Philosophy ── */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-xl mb-16">
            <Badge variant="outline" className="mb-6">
              Philosophy
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight tracking-tight mb-4">
              How we learn.
            </h2>
            <p className="text-neutral-500 leading-relaxed">
              Real engineering knowledge comes from a cycle — not a checklist. Every concept we study goes through the same loop.
            </p>
          </AnimatedSection>

          {/* Desktop: horizontal flow */}
          <AnimatedSection delay={0.15}>
            <div className="hidden md:flex items-center gap-0 overflow-x-auto pb-2">
              {philosophySteps.map((s, i) => (
                <div key={s.step} className="flex items-center">
                  <div
                    className={`flex flex-col items-center text-center px-4 py-5 rounded-2xl min-w-[120px] border transition-all ${
                      s.accent
                        ? "bg-[#ffde59] border-[#ffde59]"
                        : "bg-white border-neutral-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-mono mb-2 ${
                        s.accent ? "text-black/50" : "text-neutral-300"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-sm font-bold leading-tight ${
                        s.accent ? "text-black" : "text-black"
                      }`}
                    >
                      {s.step}
                    </span>
                    <span
                      className={`text-xs mt-1.5 leading-snug ${
                        s.accent ? "text-black/60" : "text-neutral-400"
                      }`}
                    >
                      {s.sub}
                    </span>
                  </div>
                  {i < philosophySteps.length - 1 && (
                    <div className="px-2 flex-shrink-0">
                      <ArrowRight />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical flow */}
            <div className="md:hidden flex flex-col items-start gap-0 max-w-xs">
              {philosophySteps.map((s, i) => (
                <div key={s.step} className="flex flex-col items-start w-full">
                  <div
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                      s.accent
                        ? "bg-[#ffde59] border-[#ffde59]"
                        : "bg-white border-neutral-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-mono w-6 flex-shrink-0 ${
                        s.accent ? "text-black/50" : "text-neutral-300"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <span
                        className={`text-sm font-bold block ${
                          s.accent ? "text-black" : "text-black"
                        }`}
                      >
                        {s.step}
                      </span>
                      <span
                        className={`text-xs ${
                          s.accent ? "text-black/60" : "text-neutral-400"
                        }`}
                      >
                        {s.sub}
                      </span>
                    </div>
                  </div>
                  {i < philosophySteps.length - 1 && (
                    <div className="pl-5 py-1">
                      <ArrowDown />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
