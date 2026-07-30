export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      © {new Date().getFullYear()} CourseHub. All rights reserved.
    </footer>
  );
}
