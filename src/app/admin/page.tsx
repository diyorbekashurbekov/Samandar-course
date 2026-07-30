const stats = [
  { label: "Total students", value: "1,240" },
  { label: "Active courses", value: "12" },
  { label: "Revenue (this month)", value: "2,450,000 тг" },
  { label: "Pending Kaspi payments", value: "0" },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Admin overview
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage courses, students, and payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Course management, user management, and Kaspi payment reconciliation tools will live
        here.
      </div>
    </div>
  );
}
