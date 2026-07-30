import Link from "next/link";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1 text-center">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          CourseHub
        </Link>
        <h1 className="text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue learning
        </h1>
      </div>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
          });
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <button
          type="submit"
          className="mt-2 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand/90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
