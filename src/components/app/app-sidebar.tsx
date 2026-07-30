import { NavLink } from "@/components/app/nav-link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/profile", label: "Profile" },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
      {isAdmin && (
        <>
          <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />
          <NavLink href="/admin">Admin</NavLink>
        </>
      )}
    </aside>
  );
}
