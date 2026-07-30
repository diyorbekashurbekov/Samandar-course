import { auth } from "@/auth";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppHeader } from "@/components/app/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen">
      <AppSidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-950">{children}</main>
      </div>
    </div>
  );
}
