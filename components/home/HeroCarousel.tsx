"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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

function HeroVisual() {
  const concepts = [
    { label: "Linux", top: "12%", left: "8%" },
    { label: "Networking", top: "72%", left: "6%" },
    { label: "Docker", top: "12%", right: "8%" },
    { label: "AWS", top: "72%", right: "6%" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer rings */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border border-black/8"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-black/8"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Center */}
      <motion.div
        className="relative z-10 bg-black rounded-2xl p-6 w-56 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-[#ffde59]" />
          <span className="text-white/50 text-xs font-mono tracking-wide">donivbytes.com</span>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { label: "Understand", done: true },
            { label: "Build", done: true },
            { label: "Break", active: true },
            { label: "Investigate", done: false },
          ].map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  step.done || step.active ? "bg-[#ffde59]" : "bg-white/20"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  step.active ? "text-white" : step.done ? "text-white/60" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
              {step.active && (
                <motion.span
                  className="ml-auto text-[10px] text-[#ffde59] font-mono"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  now
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/30 text-xs">phase</span>
            <span className="text-[#ffde59] text-xs font-medium">learning</span>
          </div>
        </div>
      </motion.div>

      {/* Floating concept nodes */}
      {concepts.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute bg-white border border-black/10 rounded-xl px-3 py-1.5 shadow-sm"
          style={{
            top: node.top,
            left: (node as { left?: string }).left,
            right: (node as { right?: string }).right,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
        >
          <span className="text-xs font-semibold text-black">{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24">
      <GridPattern />

      {/* Subtle accent blob */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ffde59]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="accent">Engineering Learning Platform</Badge>
              <div>
                <motion.p
                  className="text-sm font-mono text-neutral-400 mb-2 tracking-widest uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Demystifying technology
                </motion.p>
                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-[1.05] tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  DONIV
                  <span className="text-[#ffde59]">BYTES</span>
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
              We break down complex engineering concepts, build things from scratch, and document what we learn along the way.
            </motion.p>

            <motion.p
              className="text-sm font-mono text-neutral-400 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              One byte at a time.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button href="/learn" variant="accent" size="lg">
                Start Learning
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button href="/projects" variant="secondary" size="lg">
                Explore Projects
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            className="relative h-[480px] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
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
