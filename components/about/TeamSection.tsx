"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const teamMembers = [
  {
    name: "[ Team Member 1 ]",
    role: "[ Role — e.g., Cloud Architect ]",
    description: "[ PLACEHOLDER — Short bio or description of this team member's expertise and contributions. ]",
  },
  {
    name: "[ Team Member 2 ]",
    role: "[ Role — e.g., DevOps Engineer ]",
    description: "[ PLACEHOLDER — Short bio or description of this team member's expertise and contributions. ]",
  },
  {
    name: "[ Team Member 3 ]",
    role: "[ Role — e.g., AI/ML Engineer ]",
    description: "[ PLACEHOLDER — Short bio or description of this team member's expertise and contributions. ]",
  },
];

function TeamCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) {
  const initials = member.name.includes("[") ? "?" : member.name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-[#ffde59] hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {/* Image area */}
      <div className="aspect-square bg-neutral-50 flex items-center justify-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-neutral-400">{initials}</span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        {/* Accent corner */}
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#ffde59] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-black mb-1">{member.name}</h3>
        <p className="text-xs text-[#ffde59] bg-black rounded-full px-3 py-1 inline-block mb-3 font-medium">
          {member.role}
        </p>
        <p className="text-sm text-neutral-500 leading-relaxed italic">{member.description}</p>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="outline" className="mb-6">The Team</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            Built by engineers,{" "}
            <span className="text-[#ffde59]">for engineers.</span>
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            A small, focused team with deep expertise across cloud, DevOps, and AI systems.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <TeamCard key={member.name + i} member={member} index={i} />
          ))}
        </div>

        {/* Join CTA */}
        <AnimatedSection delay={0.3} className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-neutral-50 border border-neutral-100">
            <p className="text-neutral-500 text-sm">Want to build with us?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
