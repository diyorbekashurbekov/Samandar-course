import { auth, signOut } from "@/auth";

export async function UserMenu() {
  const session = await auth();
  const label = session?.user?.name ?? session?.user?.email ?? "?";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{session?.user?.role}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
        {label.charAt(0).toUpperCase()}
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-brand hover:text-brand dark:border-zinc-700 dark:text-zinc-400"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
