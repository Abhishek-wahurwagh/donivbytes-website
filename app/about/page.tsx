import type { Metadata } from "next";
import StorySection from "@/components/about/StorySection";
import FoundersSection from "@/components/about/FoundersSection";
import FoundingMembersSection from "@/components/about/FoundingMembersSection";
import TeamSection from "@/components/about/TeamSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about DONIVBYTES — our story, mission, vision, engineering philosophy, and the team behind the platform.",
};

export default function AboutPage() {
  return (
    <>
      <FoundersSection />
      <FoundingMembersSection />
      <TeamSection />
      <StorySection />
    </>
  );
}
