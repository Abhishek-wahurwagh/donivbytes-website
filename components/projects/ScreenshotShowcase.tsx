"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const screenshots = [
  {
    id: 1,
    label: "Dashboard",
    description: "Unified infrastructure overview",
    screenContent: {
      title: "CMF Dashboard",
      items: ["3 Active Clusters", "12 Pipelines Running", "99.9% Uptime"],
      accent: "#ffde59",
    },
  },
  {
    id: 2,
    label: "Pipeline View",
    description: "Real-time CI/CD monitoring",
    screenContent: {
      title: "Pipeline Status",
      items: ["Build ✓", "Test ✓", "Deploy ⟳"],
      accent: "#4ade80",
    },
  },
  {
    id: 3,
    label: "AI Insights",
    description: "Intelligent recommendations",
    screenContent: {
      title: "AI Engine",
      items: ["Cost: -23%", "Perf: +41%", "Issues: 0"],
      accent: "#60a5fa",
    },
  },
  {
    id: 4,
    label: "Infrastructure",
    description: "Multi-cloud resource management",
    screenContent: {
      title: "Resources",
      items: ["AWS: 8 nodes", "GCP: 4 nodes", "Edge: 2 nodes"],
      accent: "#f472b6",
    },
  },
];

function PhoneMockup({
  screenshot,
  index,
}: {
  screenshot: (typeof screenshots)[0];
  index: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      whileHover={{ y: -8 }}
    >
      {/* Phone frame */}
      <div className="relative w-[160px] sm:w-[180px]">
        {/* Outer shell */}
        <div className="relative bg-black rounded-[2.5rem] p-[3px] shadow-2xl">
          {/* Inner bezel */}
          <div className="bg-neutral-900 rounded-[2.2rem] overflow-hidden">
            {/* Status bar */}
            <div className="bg-black px-4 pt-3 pb-1 flex items-center justify-between">
              <span className="text-white text-[8px] font-medium">9:41</span>
              <div className="w-16 h-4 bg-black rounded-full" /> {/* Dynamic island */}
              <div className="flex gap-1 items-center">
                <div className="w-3 h-2 border border-white/60 rounded-sm">
                  <div className="w-2 h-full bg-white/60 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Screen content */}
            <div className="bg-white min-h-[280px] sm:min-h-[320px] p-4 relative overflow-hidden">
              {/* App header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-[#ffde59] text-[8px] font-bold">DB</span>
                </div>
                <span className="text-black text-[10px] font-bold">CMF</span>
              </div>

              {/* Screen title */}
              <p className="text-[9px] text-neutral-400 mb-1 font-mono">
                {screenshot.screenContent.title}
              </p>

              {/* Metric cards */}
              <div className="space-y-2">
                {screenshot.screenContent.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-neutral-50 rounded-xl p-2.5 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 + i * 0.08 }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: screenshot.screenContent.accent }}
                    />
                    <span className="text-[9px] text-black font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom nav bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-2 flex justify-around">
                {["⊞", "◎", "⊕", "☰"].map((icon, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i === 0 ? "text-black" : "text-neutral-300"}`}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="bg-black py-2 flex justify-center">
              <div className="w-24 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -right-[3px] top-20 w-[3px] h-8 bg-neutral-700 rounded-r-sm" />
        <div className="absolute -left-[3px] top-16 w-[3px] h-6 bg-neutral-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-24 w-[3px] h-6 bg-neutral-700 rounded-l-sm" />
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-black">{screenshot.label}</p>
        <p className="text-xs text-neutral-400">{screenshot.description}</p>
      </div>
    </motion.div>
  );
}

export default function ScreenshotShowcase() {
  return (
    <section className="py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="accent" className="mb-6">Mobile App</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            CMF in your pocket.
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Monitor, manage, and deploy your entire cloud infrastructure from anywhere — with the CloudMateFusion mobile application.
          </p>
        </AnimatedSection>

        {/* Phone grid */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {screenshots.map((screenshot, i) => (
            <PhoneMockup key={screenshot.id} screenshot={screenshot} index={i} />
          ))}
        </div>

        {/* Disclaimer */}
        <AnimatedSection delay={0.4} className="text-center mt-16">
          <p className="text-xs text-neutral-400 italic">
            * Screenshots represent the CMF mobile application interface. Placeholder content shown for design purposes.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
