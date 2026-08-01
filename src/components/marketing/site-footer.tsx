import Link from "next/link";
import { auth } from "@/auth";

const productLinks = [
  { href: "/courses", label: "All courses" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
];

export async function SiteFooter() {
  const session = await auth();
  const accountLinks = session?.user
    ? [{ href: "/dashboard", label: "Dashboard" }, { href: "/profile", label: "Profile" }]
    : [{ href: "/login", label: "Sign in" }];

  return (
    <footer className="border-t border-zinc-200 bg-surface-muted dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent-violet text-sm font-bold text-white">
              C
            </span>
            CourseHub
          </Link>
          <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            Video lessons, hands-on tests, and progress tracking — everything you need to go
            from beginner to job-ready, in one focused platform.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Product</h3>
          <ul className="flex flex-col gap-2">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-500 transition hover:text-brand dark:text-zinc-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Account</h3>
          <ul className="flex flex-col gap-2">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-500 transition hover:text-brand dark:text-zinc-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-zinc-500 sm:flex-row dark:text-zinc-400">
          <p>© {new Date().getFullYear()} CourseHub. All rights reserved.</p>
          <p>Built for learners who finish what they start.</p>
        </div>
      </div>
    </footer>
  );
}
