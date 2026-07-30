import { NavLink } from "@/components/app/nav-link";

const links = [{ href: "/admin", label: "Overview" }];

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Admin
      </p>
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
      {/* Manage Courses, Manage Users, and Payments sections will be added
          alongside their respective business logic. */}
    </aside>
  );
}
