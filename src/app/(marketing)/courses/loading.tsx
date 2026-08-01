export default function CoursesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="mb-12 flex flex-col gap-3">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="skeleton h-4 w-40 rounded-lg" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="skeleton aspect-video w-full rounded-xl" />
            <div className="flex flex-col gap-2">
              <div className="skeleton h-4 w-20 rounded-full" />
              <div className="skeleton h-5 w-3/4 rounded-lg" />
              <div className="skeleton h-4 w-full rounded-lg" />
              <div className="skeleton h-4 w-2/3 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
