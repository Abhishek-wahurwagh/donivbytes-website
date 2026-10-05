import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import Overview from "@/components/home/Overview";

export const metadata: Metadata = {
  title: "DONIVBYTES — Demystifying technology, one byte at a time.",
  description:
    "DONIVBYTES is an engineering learning and experimentation platform. We break down complex technical concepts, build real systems, and document what we learn along the way.",
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Overview />
    </>
  );
}
