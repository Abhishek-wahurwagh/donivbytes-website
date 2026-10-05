import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — DONIVBYTES",
    template: "%s | Admin — DONIVBYTES",
  },
  robots: { index: false, follow: false },
};

/**
 * Admin layout intentionally excludes the public Navbar and Footer.
 * Authentication guard is handled client-side in each admin page.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-neutral-50">{children}</div>;
}
