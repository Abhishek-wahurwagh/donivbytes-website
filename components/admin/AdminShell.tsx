"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken, clearToken, getMe } from "@/lib/api";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3h12M2 8h12M2 13h7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface AdminShellProps {
  children: ReactNode;
  title?: string;
}

export default function AdminShell({ children, title }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getMe()
      .then((u) => {
        setAdminName(u.name);
        setChecking(false);
      })
      .catch(() => {
        clearToken();
        router.replace("/admin/login");
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <span className="text-sm text-neutral-400">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 bg-black flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <Image src="/VCUT.png" alt="DONIVBYTES" width={24} height={24} className="object-contain" />
          <span className="text-sm font-bold text-white tracking-tight">DONIVBYTES</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#ffde59] text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <div className="text-xs text-white/40 truncate">{adminName}</div>
          <button
            onClick={() => {
              clearToken();
              router.push("/admin/login");
            }}
            className="text-xs text-white/50 hover:text-[#ffde59] transition-colors"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="block text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Public site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {title && (
          <header className="bg-white border-b border-neutral-200 px-8 py-5">
            <h1 className="text-lg font-bold text-black tracking-tight">{title}</h1>
          </header>
        )}
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
