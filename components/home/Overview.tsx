"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const pillars = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Cloud Engineering",
    description: "Architecting resilient, scalable cloud infrastructure across AWS, GCP, and hybrid environments.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "DevOps & Automation",
    description: "End-to-end CI/CD pipelines, infrastructure as code, and automated deployment workflows.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI Integration",
    description: "Embedding intelligent automation and ML-driven insights into every layer of the stack.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Scalable Systems",
    description: "Designing distributed systems that grow with your business — from zero to planetary scale.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Security First",
    description: "Zero-trust architecture, compliance automation, and security baked into every deployment.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Platform Engineering",
    description: "Building internal developer platforms that accelerate teams and reduce operational overhead.",
  },
];

export default function Overview() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="max-w-3xl mb-20">
          <Badge variant="outline" className="mb-6">
            What We Build
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-black leading-tight tracking-tight mb-6">
            Engineering the future,{" "}
            <span className="relative inline-block">
              one byte
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffde59] rounded-full" />
            </span>{" "}
            at a time.
          </h2>
          <p className="text-lg text-neutral-500 leading-relaxed">
            DONIVBYTES is a cloud-native engineering collective focused on building infrastructure, platforms, intelligent systems, and making technology a little less intimidating for people trying to learn it.
Working across cloud engineering, DevOps, AI, and education, we're building scalable systems, automating repetitive problems, sharing what we learn, and slowly turning late-night engineering experiments into something that hopefully survives production.
          </p>
        </AnimatedSection>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.title} delay={i * 0.08}>
              <div className="group p-6 rounded-2xl border border-neutral-100 hover:border-[#ffde59] hover:shadow-sm transition-all duration-300 bg-white h-full">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 group-hover:bg-[#ffde59] flex items-center justify-center mb-4 transition-colors duration-300">
                  {pillar.icon}
                </div>
                <h3 className="font-semibold text-black mb-2">{pillar.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{pillar.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats row */}
        <AnimatedSection delay={0.3} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-neutral-100">
            {[
              { value: "100%", label: "Cloud-Native" },
              { value: "∞", label: "Scalability" },
              { value: "0→1", label: "Product Velocity" },
              { value: "24/7", label: "Uptime Focus" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
