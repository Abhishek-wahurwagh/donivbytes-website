"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const slides = [
  {
    id: 1,
    badge: "Featured Project",
    title: "CloudMateFusion",
    subtitle: "CMF",
    tagline: "Overview of CMF Project",
    description:
      "A cloud-native platform engineered for scale. CloudMateFusion unifies DevOps pipelines, AI-driven automation, and real-time infrastructure orchestration into a single, elegant interface.",
    tags: ["Cloud-Native", "AI/ML", "DevOps", "Kubernetes"],
    cta: [
      { label: "Explore CMF", href: "/projects", variant: "accent" as const },
      { label: "View Projects", href: "/projects", variant: "secondary" as const },
    ],
    visual: {
      accent: "#ffde59",
      pattern: "grid",
    },
  },
];

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function CMFVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ring */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border border-black/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-52 h-52 rounded-full border border-black/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Center card */}
      <motion.div
        className="relative z-10 bg-black rounded-2xl p-6 w-52 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#ffde59]" />
          <span className="text-white/60 text-xs font-mono">cmf.cloud</span>
        </div>
        <div className="space-y-2 mb-4">
          {["Infrastructure", "Pipelines", "AI Engine"].map((item, i) => (
            <motion.div
              key={item}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffde59]" />
              <span className="text-white text-xs font-medium">{item}</span>
              <div className="ml-auto w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#ffde59] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${[85, 72, 91][i]}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">Status</span>
            <span className="text-[#ffde59] text-xs font-medium">● Live</span>
          </div>
        </div>
      </motion.div>

      {/* Floating nodes */}
      {[
        { top: "15%", left: "10%", label: "K8s", delay: 0.5 },
        { top: "70%", left: "8%", label: "CI/CD", delay: 0.7 },
        { top: "15%", right: "10%", label: "AI", delay: 0.6 },
        { top: "70%", right: "8%", label: "IaC", delay: 0.8 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute bg-white border border-black/10 rounded-xl px-3 py-1.5 shadow-sm"
          style={{ top: node.top, left: node.left, right: (node as { right?: string }).right }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: node.delay, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xs font-semibold text-black">{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slide = slides[current];

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24">
      <GridPattern />

      {/* Accent blob */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ffde59]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left — Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="accent">{slide.badge}</Badge>
                <div>
                  <motion.p
                    className="text-sm font-mono text-neutral-400 mb-2 tracking-widest uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {slide.tagline}
                  </motion.p>
                  <motion.h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-[1.05] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {slide.title}
                    <span className="text-[#ffde59]">.</span>
                  </motion.h1>
                </div>
              </div>

              <motion.p
                className="text-lg text-neutral-500 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {slide.description}
              </motion.p>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {slide.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.cta.map((btn) => (
                  <Button key={btn.label} href={btn.href} variant={btn.variant} size="lg">
                    {btn.label}
                    {btn.variant === "accent" && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Button>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right — Visual */}
          <motion.div
            className="relative h-[480px] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <CMFVisual />
          </motion.div>
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="flex items-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-black" : "w-4 bg-neutral-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs text-neutral-400 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-neutral-400 to-transparent" />
      </motion.div>
    </section>
  );
}
