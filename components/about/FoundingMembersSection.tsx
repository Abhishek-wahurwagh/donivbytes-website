"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const foundingMembers = [
  {
    name: "[ Founding Member 1 ]",
    role: "[ Role — e.g., Lead Engineer ]",
    description:
      "[ PLACEHOLDER — Short bio or description of this founding member's expertise and contributions to DONIVBYTES. ]",
  },
  {
    name: "[ Founding Member 2 ]",
    role: "[ Role — e.g., Product Architect ]",
    description:
      "[ PLACEHOLDER — Short bio or description of this founding member's expertise and contributions to DONIVBYTES. ]",
  },
  {
    name: "[ Founding Member 3 ]",
    role: "[ Role — e.g., Infrastructure Lead ]",
    description:
      "[ PLACEHOLDER — Short bio or description of this founding member's expertise and contributions to DONIVBYTES. ]",
  },
];

function FoundingMemberCard({
  member,
  index,
}: {
  member: (typeof foundingMembers)[0];
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

export default function FoundingMembersSection() {
  return (
    <section className="py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="accent" className="mb-6">Founding Members</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            The builders who{" "}
            <span className="text-[#ffde59]">started it all.</span>
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            The founding members who laid the foundation of DONIVBYTES — bringing deep expertise, shared vision, and relentless execution.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foundingMembers.map((member, i) => (
            <FoundingMemberCard key={member.name + i} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
