import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AppHeader } from "@/components/app/app-header";

// TODO: restrict access to ADMIN-role users once role-based authorization is
// implemented — the session already carries `role` (see src/auth.config.ts),
// this just needs a check + redirect wired in here.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-950">{children}</main>
      </div>
    </div>
  );
}
