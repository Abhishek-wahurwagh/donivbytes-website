"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getToken, clearToken, getMe, CurrentUser } from "@/lib/api";

const learnDropdown = [
  { label: "Courses", href: "/learn/courses", description: "Structured technical courses" },
  { label: "Learning Paths", href: "/learn/paths", description: "Guided progression routes" },
  { label: "Resources", href: "/learn/resources", description: "Notes, references & guides" },
  { label: "My Learning", href: "/learn/my-learning", description: "Your progress & enrollments" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experiments", href: "/experiments" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileLearnLinks = [
  { label: "Learn", href: "/learn" },
  ...learnDropdown.map((l) => ({ label: `  ${l.label}`, href: l.href })),
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const learnRef = useRef<HTMLDivElement>(null);
  const [authUser, setAuthUser] = useState<CurrentUser | null>(null);

  // Load auth state on mount and on route change
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthUser(null);
      return;
    }
    getMe()
      .then(setAuthUser)
      .catch(() => {
        clearToken();
        setAuthUser(null);
      });
  }, [pathname]);

  function handleLogout() {
    clearToken();
    setAuthUser(null);
    setMobileOpen(false);
    router.push("/");
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setLearnOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const isLearnActive = pathname.startsWith("/learn");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3 mx-4 mt-3" : "py-4 mx-0 mt-0"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-sm"
              : "bg-transparent"
          }`}
        >
          <nav className="flex items-center justify-between h-14">
            {/* Left — Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === "/"
                    ? "text-black"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {pathname === "/" && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#ffde59] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Home</span>
              </Link>

              {/* Learn dropdown */}
              <div ref={learnRef} className="relative">
                <button
                  onClick={() => setLearnOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLearnOpen((v) => !v);
                    }
                    if (e.key === "Escape") setLearnOpen(false);
                  }}
                  aria-haspopup="true"
                  aria-expanded={learnOpen}
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isLearnActive
                      ? "text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {isLearnActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#ffde59] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Learn</span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="relative z-10"
                    animate={{ rotate: learnOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {learnOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-full left-0 mt-2 w-60 bg-white border border-neutral-150 rounded-2xl shadow-lg overflow-hidden"
                      role="menu"
                    >
                      <div className="p-1.5">
                        <Link
                          href="/learn"
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#ffde59]/20 transition-colors group"
                          role="menuitem"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ffde59] flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-black">Learn</div>
                            <div className="text-xs text-neutral-400">Overview & approach</div>
                          </div>
                        </Link>
                        <div className="my-1.5 border-t border-neutral-100" />
                        {learnDropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                            role="menuitem"
                          >
                            <div className="w-1 h-1 rounded-full bg-neutral-300 group-hover:bg-[#ffde59] flex-shrink-0 transition-colors" />
                            <div>
                              <div className="text-sm font-medium text-black">{item.label}</div>
                              <div className="text-xs text-neutral-400">{item.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rest of nav links */}
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pathname === link.href
                      ? "text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#ffde59] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Center / Right — Logo + Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/VCUT.png"
                  alt="DONIVBYTES Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <Link href="/" className="flex items-center">
                <span className="font-bold text-base tracking-tight text-black">
                  DONIVBYTES
                </span>
              </Link>
            </div>

            {/* Desktop auth actions */}
            <div className="hidden md:flex items-center gap-2">
              {authUser ? (
                <>
                  <Link
                    href="/my-learning"
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      pathname === "/my-learning"
                        ? "text-black"
                        : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    {pathname === "/my-learning" && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[#ffde59] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">My Learning</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-black rounded-full transition-all duration-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-black rounded-full transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-semibold text-black bg-[#ffde59] hover:bg-[#e6c800] rounded-full transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-black rounded-full origin-center transition-all"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="block w-5 h-0.5 bg-black rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-black rounded-full origin-center transition-all"
              />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-white flex flex-col items-center justify-center gap-5 overflow-y-auto py-20"
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Home */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-black hover:text-[#ffde59] transition-colors"
              >
                Home
              </Link>
            </motion.div>

            {/* Learn group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="flex flex-col items-center gap-2"
            >
              <Link
                href="/learn"
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-black hover:text-[#ffde59] transition-colors"
              >
                Learn
              </Link>
              <div className="flex flex-wrap justify-center gap-3 mt-1">
                {learnDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-neutral-400 hover:text-black transition-colors border border-neutral-200 rounded-full px-3 py-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Remaining links */}
            {navLinks.slice(1).map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 2) * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-3xl font-bold text-black hover:text-[#ffde59] transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile auth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navLinks.length + 1) * 0.06 }}
              className="flex flex-col items-center gap-3 mt-2"
            >
              {authUser ? (
                <>
                  <Link
                    href="/my-learning"
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-bold text-black hover:text-[#ffde59] transition-colors"
                  >
                    My Learning
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-base font-medium text-neutral-400 hover:text-black transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-bold text-black hover:text-[#ffde59] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-black bg-[#ffde59] hover:bg-[#e6c800] transition-colors px-6 py-2 rounded-full"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
