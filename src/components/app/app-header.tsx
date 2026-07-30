import Link from "next/link";
import { UserMenu } from "@/components/app/user-menu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sm:justify-end">
      <Link
        href="/"
        className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:hidden"
      >
        CourseHub
      </Link>
      <UserMenu />
    </header>
  );
}
