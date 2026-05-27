"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: "☁️",
    title: "Cloud-Native Architecture",
    description: "Built on Kubernetes with microservices, service mesh, and cloud-agnostic infrastructure patterns.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Automation",
    description: "Intelligent pipeline orchestration, anomaly detection, and predictive scaling powered by ML models.",
  },
  {
    icon: "⚡",
    title: "Real-Time Pipelines",
    description: "Event-driven CI/CD pipelines with sub-second feedback loops and automated rollback capabilities.",
  },
  {
    icon: "🔒",
    title: "Zero-Trust Security",
    description: "End-to-end encryption, RBAC, secrets management, and compliance automation built-in.",
  },
  {
    icon: "📊",
    title: "Observability Suite",
    description: "Unified metrics, logs, and traces with intelligent alerting and root cause analysis.",
  },
  {
    icon: "🌐",
    title: "Multi-Cloud Support",
    description: "Seamless deployment across AWS, GCP, Azure, and on-premise environments from a single control plane.",
  },
];

const architectureLayers = [
  { label: "Presentation Layer", items: ["Mobile App (React Native)", "Web Dashboard", "CLI Tool"], color: "bg-[#ffde59]" },
  { label: "API Gateway", items: ["GraphQL API", "REST Endpoints", "WebSocket"], color: "bg-black" },
  { label: "Core Services", items: ["Pipeline Engine", "AI Orchestrator", "Config Manager"], color: "bg-neutral-800" },
  { label: "Infrastructure", items: ["Kubernetes", "Terraform", "Service Mesh"], color: "bg-neutral-600" },
  { label: "Data Layer", items: ["PostgreSQL", "Redis", "Object Storage"], color: "bg-neutral-400" },
];

export default function CMFProject() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="py-28 bg-white" id="cmf">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <Badge variant="accent" className="mb-6">Featured Project</Badge>
              <h1 className="text-5xl sm:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
                CloudMate
                <span className="text-[#ffde59]">Fusion</span>
                <br />
                <span className="text-2xl sm:text-3xl font-mono text-neutral-400">CMF</span>
              </h1>
              <p className="text-lg text-neutral-500 leading-relaxed mb-8">
                A unified cloud-native platform that fuses DevOps automation, AI-driven intelligence, and real-time infrastructure orchestration into a single, elegant engineering experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg">
                  View Screenshots
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
                <Button variant="secondary" size="lg">Learn More</Button>
              </div>
            </AnimatedSection>

            {/* Visual */}
            <AnimatedSection direction="left" delay={0.2}>
              <div className="bg-black rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffde59]/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-md px-3 py-1">
                      <span className="text-white/40 text-xs font-mono">cmf.donivbytes.cloud</span>
                    </div>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    {[
                      { text: "$ cmf deploy --env production", color: "text-[#ffde59]" },
                      { text: "✓ Infrastructure validated", color: "text-green-400" },
                      { text: "✓ AI pipeline optimized", color: "text-green-400" },
                      { text: "✓ Security scan passed", color: "text-green-400" },
                      { text: "⟳ Deploying to 3 regions...", color: "text-blue-400" },
                      { text: "✓ Deployment complete (2.3s)", color: "text-green-400" },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        className={line.color}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">Vision</Badge>
            <h2 className="text-4xl font-bold text-black mb-6 tracking-tight">
              The future of cloud operations is unified.
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              CloudMateFusion envisions a world where infrastructure management, deployment automation, and AI-driven optimization converge into a single, intuitive platform — eliminating the complexity that slows engineering teams down and replacing it with clarity, speed, and intelligence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-black tracking-tight">
              Everything you need to ship faster.
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-neutral-100 hover:border-[#ffde59] hover:shadow-sm transition-all duration-300 h-full">
                  <div className="text-2xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-28 bg-black text-white" id="architecture">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16">
            <Badge variant="accent" className="mb-4">Architecture</Badge>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
              Built for scale from day one.
            </h2>
            <p className="text-neutral-400 max-w-xl">
              A layered, cloud-native architecture designed for resilience, observability, and infinite horizontal scale.
            </p>
          </AnimatedSection>

          <div className="space-y-3 max-w-2xl">
            {architectureLayers.map((layer, i) => (
              <AnimatedSection key={layer.label} delay={i * 0.1}>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffde59]/30 transition-colors">
                  <div className={`w-2 h-12 rounded-full ${layer.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <p className="text-xs text-white/40 mb-1 font-mono">{layer.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span key={item} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
