import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with DONIVBYTES. Collaborate, build, or just talk cloud engineering.",
};

export default function ContactPage() {
  return <ContactSection />;
}
