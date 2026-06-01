"use client";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const foundingMembers = [
  {
    name: "Omkar R Patil",
    role: "Co-Founder & Lead AI Engineer ",
     image: "8.jpg",
    linkedin: "https://www.linkedin.com/in/omkar-patil-7b32942aa",
    description:"Usually teaching machines how to think while the rest of us are still defining the problem. Responsible for many of the team's smartest ideas and most ambitious experiments."
  },
  {
    name: "Ankit V Patil",
    role: "Co-Founder & AI Infrastructure Engineer",
    image: "ankya.jpg",
    linkedin: "https://www.linkedin.com/in/ankit-patil-3b9148260",
    description:
      "Usually found experimenting with AI models and asking 'what if we try this?' one more time.Works on both AI systems and the infrastructure that powers them. Usually found automating something, optimizing something else, and occasionally creating three new ideas before the current one is finished.",
  },
  {
    name: "Sanika Gulkotwar",
    role: "Co-Founder & Operations Lead",
    image: "9.jpg",
    linkedin: "https://www.linkedin.com/in/sanika-gulkotwar-ab8484241",
    description:
      "Responsible for operations, planning, and occasionally reminding the engineering team that products need users, not just features. Also learning the technical side fast enough to keep up with the chaos.",
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
      <div className="aspect-square relative overflow-hidden">
   <Image
    src={`/team/${member.image}`}
     alt={member.name}
     fill
    className="object-cover transition-transform duration-500 group-hover:scale-110"
   />

  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#ffde59] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-black">
            {member.name}
          </h3>
          <a href={member.linkedin} target="_blank"  rel="noopener noreferrer"
          className="text-[#0A66C2] hover:scale-210 transition-all duration-300">
          <FaLinkedin size={24} />
          </a>
        </div>
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
