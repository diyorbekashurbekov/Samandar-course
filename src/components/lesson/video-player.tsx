export function VideoPlayer({ title }: { title: string }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl">
          ▶
        </div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-zinc-500">Video player placeholder</p>
      </div>
    </div>
  );
}
