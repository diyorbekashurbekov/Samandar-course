"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
];

export function HeaderChrome({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "border-zinc-200 bg-white/85 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/85"
          : "border-transparent bg-white/60 backdrop-blur-sm dark:bg-zinc-950/60"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[height] duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent-violet text-sm font-bold text-white">
            C
          </span>
          CourseHub
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {link.label}
              <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ctaHref}
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90 hover:shadow-md sm:inline-flex"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 sm:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              animate={menuOpen ? "open" : "closed"}
            >
              <motion.path
                d="M2.5 5h13M2.5 13h13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M2.5 5h13M2.5 13h13" },
                  open: { d: "M4 4l10 10M14 4L4 14" },
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden border-t border-zinc-200 bg-white/95 backdrop-blur-lg sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-brand px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand/90"
              >
                {ctaLabel}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
