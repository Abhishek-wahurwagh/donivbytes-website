"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, getToken, ApiError } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <Image
            src="/VCUT.png"
            alt="DONIVBYTES"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-sm tracking-tight text-black">
            DONIVBYTES
          </span>
          <span className="text-xs text-neutral-400 ml-1">Admin</span>
        </div>

        <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
          Sign in
        </h1>
        <p className="text-sm text-neutral-400 mb-8">
          Admin access only.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-neutral-600 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-neutral-600 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffde59] text-black font-semibold text-sm py-2.5 rounded-xl hover:bg-[#e6c800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
