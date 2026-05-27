import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import Overview from "@/components/home/Overview";

export const metadata: Metadata = {
  title: "DONIVBYTES — One byte at a time.",
  description:
    "DONIVBYTES is a cloud-native engineering platform. Explore CloudMateFusion (CMF) and our engineering ecosystem.",
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Overview />
    </>
  );
}
