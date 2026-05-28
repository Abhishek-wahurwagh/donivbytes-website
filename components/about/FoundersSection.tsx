"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

const founders = [
  {
    name: "Abhishek V Wahurwagh",
    role: "Founder & CEO",
    image: null,
    bio: "I am ceo of ",
    highlights: [
      "[  in cloud infrastructure ]",
      "[ Highlight 2 — e.g., Former engineer at X ]",
      "[ Highlight 3 — e.g., Open source contributor ]",
    ],
    imageRight: false,
  },
];

function AvatarPlaceholder({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = size === "lg" ? "w-full h-full text-4xl" : "w-full h-full text-xl";

  return (
    <div className={`${sizeClasses} bg-neutral-100 flex items-center justify-center font-bold text-neutral-400`}>
      {initials.includes("[") ? "?" : initials}
    </div>
  );
}

export default function FoundersSection() {
  return (
    <section className="py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <Badge variant="accent" className="mb-6">Leadership</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-4">
            The people behind the bytes.
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            A team of engineers, builders, and visionaries committed to redefining cloud-native development.
          </p>
        </AnimatedSection>

        <div className="space-y-24">
          {founders.map((founder) => (
            <AnimatedSection key={founder.name} delay={0.1}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  founder.imageRight ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <motion.div
                  className={`${founder.imageRight ? "lg:col-start-2" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="w-full aspect-[4/5] max-w-sm mx-auto rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
                      <AvatarPlaceholder name={founder.name} size="lg" />
                    </div>
                    {/* Name card below image */}
                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold text-black">{founder.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{founder.role}</p>
                    </div>
                    {/* Accent dot */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#ffde59] rounded-full" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className={`${founder.imageRight ? "lg:col-start-1 lg:row-start-1" : ""} space-y-6`}>
                  <div>
                    <Badge variant="outline" className="mb-3">{founder.role}</Badge>
                    <h3 className="text-3xl font-bold text-black mb-4">{founder.name}</h3>
                    <p className="text-neutral-500 leading-relaxed italic border-l-2 border-[#ffde59] pl-4">
                      {founder.bio}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {founder.highlights.map((highlight, j) => (
                      <motion.div
                        key={j}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#ffde59] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-neutral-500 italic">{highlight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
