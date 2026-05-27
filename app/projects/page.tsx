import type { Metadata } from "next";
import CMFProject from "@/components/projects/CMFProject";
import ScreenshotShowcase from "@/components/projects/ScreenshotShowcase";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore DONIVBYTES projects — CloudMateFusion (CMF), a cloud-native platform for DevOps automation, AI integration, and scalable infrastructure management.",
};

export default function ProjectsPage() {
  return (
    <>
      <CMFProject />
      <ScreenshotShowcase />
    </>
  );
}
