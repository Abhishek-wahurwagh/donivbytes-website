"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { login, getToken, ApiError } from "@/lib/api";

// ─── Grid pattern (matches homepage) ─────────────────────────────────────────

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid-login" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-login)" />
    </svg>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  placeholder,
  minLength,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        minLength={minLength}
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-black bg-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}

// ─── Form (needs Suspense because it uses useSearchParams) ────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/my-learning";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect already-authed users
  useEffect(() => {
    if (getToken()) router.replace(next);
  }, [router, next]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to connect. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
      />

      {error && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
        className="w-full bg-[#ffde59] text-black font-semibold text-sm py-3 rounded-xl hover:bg-[#e6c800] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </motion.button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <GridPattern />

      {/* Subtle accent blob */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#ffde59]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Brand */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src="/VCUT.png"
                alt="DONIVBYTES"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-black group-hover:text-neutral-600 transition-colors">
              DONIVBYTES
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-black tracking-tight leading-tight mb-3">
              Sign in<span className="text-[#ffde59]">.</span>
            </h1>
            <p className="text-base text-neutral-400 leading-relaxed">
              Welcome back. Continue learning where you left off.
            </p>
          </div>

          {/* Form — wrapped in Suspense for useSearchParams */}
          <Suspense
            fallback={
              <div className="space-y-5">
                <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-12 rounded-xl bg-neutral-100 animate-pulse" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Footer */}
          <p className="mt-6 text-sm text-neutral-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-black hover:text-neutral-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
