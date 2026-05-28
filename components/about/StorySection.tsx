"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const storyBlocks = [
  {
    label: "Origin Story",
    placeholder: "It started during the second year of BCA. I Abhishek(Founder) was trying to learn cloud computing and quickly realized learning cloud somehow first requires learning ten other things before learning cloud.AWS, GCP, Azure — every platform opened new possibilities, but also new complexity. Back then, even running Linux virtual machines felt like negotiating with laptop hardware that had already mentally retired. Then came cloud resources. Suddenly learning, experimenting, breaking things, and rebuilding things became possible. Alongside Omkar, we built one of our early college projects — an FTP file-sharing application. Later came the first version of CMF (CloudMateFusion). It was basic. No real-time provisioning. No advanced automation. Just an idea trying to become something bigger. While deploying projects and websites, another reality became obvious: Building is exciting. Running things long term is where reality sends the invoice. That eventually led to DONIVBYTES — a platform built around a simple idea: Learn technology. Build with technology. Deploy with technology.One byte at a time.",
  },
  {
    label: "Mission",
    placeholder: "Make modern technology easier to learn, easier to build with, and easier to deploy. DONIVBYTES exists to help people understand cloud, DevOps, AI, and engineering systems without spending weeks figuring out where to even begin. Learn technology. Build with technology. Deploy with technology. Break things occasionally. Learn even more.",

  },
  {
    label: "Vision",
    placeholder: "Build a platform where learning and building exist together.A space where students, developers, and builders can experiment, deploy small-scale projects, understand infrastructure, and turn ideas into working systems — without requiring enterprise budgets, expensive hardware, or twenty browser tabs explaining one concept.",
  },
  {
    label: "Engineering Philosophy",
    placeholder: "DONIVBYTES believes engineering is about building first and overthinking less, learning deeply, documenting what matters, automating repetitive work, and designing systems that scale beyond the first successful deployment. Technology moves fast enough already — pretending to know everything only slows learning down. We believe good engineering is not about appearing smart; it is about staying curious, continuously learning, building better systems, and surviving production deployments with dignity still intact",
  },
];

export default function StorySection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left — Heading */}
          <AnimatedSection className="lg:sticky lg:top-32">
            <Badge variant="outline" className="mb-6">Our Story</Badge>
            <h2 className="text-5xl sm:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
              The story of{" "}
              <span className="relative">
                DONIV
                <span className="text-[#ffde59]">BYTES</span>
              </span>
              <span className="text-[#ffde59]">.</span>
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              &ldquo;One byte at a time.&rdquo;
            </p>

            {/* Decorative element */}
            <div className="mt-12 p-6 bg-black rounded-2xl">
              <p className="text-[#ffde59] font-mono text-sm mb-2"></p>
              <p className="text-white text-xl font-semibold">Every great platform starts with a problem worth solving. Here&apos;s ours.</p>
              <p className="text-white/40 text-sm mt-2">  — DONIVBYTES</p>
            </div>
          </AnimatedSection>

          {/* Right — Story blocks */}
          <div className="space-y-8">
            {storyBlocks.map((block, i) => (
              <AnimatedSection key={block.label} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#ffde59] flex items-center justify-center">
                      <span className="text-black text-xs font-bold">{i + 1}</span>
                    </div>
                    <h3 className="font-semibold text-black text-lg">{block.label}</h3>
                  </div>
                  <div className="min-h-[80px] flex items-center">
                    <p className="text-neutral-400 text-sm leading-relaxed italic border-l-2 border-[#ffde59] pl-4">
                      {block.placeholder}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
