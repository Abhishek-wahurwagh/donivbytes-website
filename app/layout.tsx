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
    default: "DONIVBYTES — One byte at a time.",
    template: "%s | DONIVBYTES",
  },
  description:
    "DONIVBYTES is a cloud-native engineering platform building scalable infrastructure, DevOps automation, and AI-powered systems. Just Another Cloud Platform.",
  keywords: [
    "cloud engineering",
    "DevOps",
    "AI",
    "Kubernetes",
    "infrastructure",
    "platform engineering",
    "DONIVBYTES",
    "CloudMateFusion",
    "CMF",
  ],
  authors: [{ name: "DONIVBYTES" }],
  creator: "DONIVBYTES",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://donivbytes.com",
    siteName: "DONIVBYTES",
    title: "DONIVBYTES — One byte at a time.",
    description:
      "Cloud-native engineering platform. DevOps, AI, and scalable systems — built one byte at a time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DONIVBYTES — One byte at a time.",
    description: "Cloud-native engineering platform. DevOps, AI, and scalable systems.",
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
