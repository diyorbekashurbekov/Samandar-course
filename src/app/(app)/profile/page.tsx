import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const label = user?.name ?? user?.email ?? "?";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Profile</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your account details.</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-xl font-semibold text-brand">
          {label.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {user?.name ?? "Unnamed user"}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</p>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Account</h2>
        <ProfileRow label="Role" value={user?.role ?? "STUDENT"} />
        <ProfileRow label="Email" value={user?.email ?? "—"} />
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Billing</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Kaspi payment history will appear here once payments are integrated.
        </p>
      </section>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 first:border-none first:pt-0 dark:border-zinc-800">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  );
}
