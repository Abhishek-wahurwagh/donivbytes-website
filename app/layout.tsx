import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DONIVBYTES — Demystifying technology, one byte at a time.",
    template: "%s | DONIVBYTES",
  },
  description:
    "DONIVBYTES is an engineering learning and experimentation platform. We break down complex technical concepts, build real systems, and document what we learn along the way.",
  keywords: [
    "engineering learning",
    "cloud engineering",
    "Linux",
    "networking",
    "Docker",
    "AWS",
    "DevOps",
    "infrastructure",
    "DONIVBYTES",
    "CloudMateFusion",
    "engineering experiments",
  ],
  authors: [{ name: "DONIVBYTES" }],
  creator: "DONIVBYTES",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://donivbytes.com",
    siteName: "DONIVBYTES",
    title: "DONIVBYTES — Demystifying technology, one byte at a time.",
    description:
      "Engineering learning and experimentation platform. We break down complex concepts, build real systems, and document what we learn.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DONIVBYTES — Demystifying technology, one byte at a time.",
    description:
      "Engineering learning and experimentation platform. Break things. Investigate why. Understand deeper.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
