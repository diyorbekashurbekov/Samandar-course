import Link from "next/link";
import { auth } from "@/auth";

const navLinks = [{ href: "/courses", label: "Courses" }];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          CourseHub
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href={session?.user ? "/dashboard" : "/login"}
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
        >
          {session?.user ? "Dashboard" : "Sign in"}
        </Link>
      </div>
    </header>
  );
}
