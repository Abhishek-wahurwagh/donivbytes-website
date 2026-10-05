import type { Metadata } from "next";
import CMFProject from "@/components/projects/CMFProject";
import ScreenshotShowcase from "@/components/projects/ScreenshotShowcase";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "DONIVBYTES projects — real systems built while learning. Explore CloudMateFusion (CMF), a cloud learning platform built through hands-on exploration of cloud infrastructure and platform engineering.",
};

export default function ProjectsPage() {
  return (
    <>
      <CMFProject />
      <ScreenshotShowcase />
    </>
  );
}
