"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { register, login, getToken, ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/my-learning");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      await login(email, password);
      router.replace("/my-learning");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <Image src="/VCUT.png" alt="DONIVBYTES" width={28} height={28} className="object-contain" />
          <Link href="/" className="font-bold text-sm tracking-tight text-black">
            DONIVBYTES
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-black tracking-tight mb-1">Create account</h1>
        <p className="text-sm text-neutral-400 mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-black underline hover:no-underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-neutral-600 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-600 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-neutral-600 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition"
              placeholder="Minimum 8 characters"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffde59] text-black font-semibold text-sm py-2.5 rounded-xl hover:bg-[#e6c800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-xs text-neutral-400 text-center pt-1">
            By signing up you agree to learn things.
          </p>
        </form>
      </div>
    </div>
  );
}
