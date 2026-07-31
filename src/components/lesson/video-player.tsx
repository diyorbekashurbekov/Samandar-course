"use client";

import { useEffect, useRef, useState } from "react";
import type Plyr from "plyr";

const RESUME_THRESHOLD_SECONDS = 5;

export function VideoPlayer({
  src,
  title,
  lessonId,
}: {
  src: string;
  title: string;
  /** Used as the localStorage key for remembering playback position on this device. */
  lessonId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let player: Plyr | null = null;

    setStatus("loading");
    video.load();

    const storageKey = `coursehub:video-position:${lessonId}`;

    function handleReady() {
      setStatus("ready");
      const saved = Number(localStorage.getItem(storageKey));
      if (video && saved > RESUME_THRESHOLD_SECONDS && saved < video.duration - RESUME_THRESHOLD_SECONDS && player) {
        player.currentTime = saved;
      }
    }

    function handleTimeUpdate() {
      if (video && video.currentTime > 0) {
        localStorage.setItem(storageKey, String(Math.floor(video.currentTime)));
      }
    }

    function handleError() {
      setStatus("error");
    }

    // Plyr touches `document` at import time, so it must be loaded lazily
    // here rather than at module scope — this component still renders once
    // on the server for the initial HTML, where `document` doesn't exist.
    import("plyr").then(({ default: PlyrConstructor }) => {
      if (cancelled || !video) return;

      player = new PlyrConstructor(video, {
        seekTime: 10,
        keyboard: { focused: true, global: false },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        settings: ["speed"],
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
      });

      player.on("ready", handleReady);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("error", handleError);
    });

    return () => {
      cancelled = true;
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
      player?.destroy();
    };
  }, [src, lessonId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-zinc-900 px-6 text-center">
          <p className="text-sm font-medium text-zinc-200">This video couldn&apos;t be played</p>
          <p className="text-xs text-zinc-500">Check your connection and try reloading the page.</p>
        </div>
      )}
      <video ref={videoRef} className="h-full w-full" playsInline controls src={src} title={title} />
    </div>
  );
}
