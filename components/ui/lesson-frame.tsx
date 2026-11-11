"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/provider";
import { LESSON_SANDBOX } from "@/lib/lesson-html";
import { cn } from "./cn";

type Mode = "fit" | "laptop" | "phone";

/** Width the lesson is laid out at in "Laptop" preview: a common laptop browser window. */
const LAPTOP_WIDTH = 1280;

/**
 * Sticker frame that renders lesson HTML in an opaque-origin sandbox.
 * Pass `src` (published lesson, /raw/<slug>) or `srcDoc` (admin preview, already run
 * through prepareLessonHtml).
 *
 * Without `showDeviceToggle` (student viewer) the lesson simply fills the frame.
 * With it (teacher preview) there are two honest previews:
 * - Laptop: the lesson is laid out at a real 1280px width, then scaled down to fit,
 *   so it looks exactly like "Open full screen" on a laptop.
 * - Phone: the lesson is laid out at a real 390px width.
 */
export function LessonFrame({
  title,
  src,
  srcDoc,
  showDeviceToggle = false,
  className,
}: {
  title: string;
  src?: string;
  srcDoc?: string;
  showDeviceToggle?: boolean;
  className?: string;
}) {
  const t = useI18n().dict.common.frame;
  const [mode, setMode] = useState<Mode>(showDeviceToggle ? "laptop" : "fit");
  const [loaded, setLoaded] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = mode === "laptop" && size.width > 0 ? Math.min(1, size.width / LAPTOP_WIDTH) : 1;
  const iframeStyle =
    mode === "laptop" && size.width > 0
      ? {
          width: LAPTOP_WIDTH,
          height: size.height / scale,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }
      : undefined;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showDeviceToggle ? (
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label={t.previewSize} className="inline-flex gap-1 rounded-full border-2 border-ink bg-surface p-1">
            {(["laptop", "phone"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors duration-150",
                  mode === m ? "bg-ink text-sun" : "text-ink hover:bg-sky focus-visible:bg-sky",
                )}
              >
                {m === "laptop" ? t.laptop : t.phone}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className={cn("relative mx-auto w-full", mode === "phone" && "max-w-[390px]")}>
        <div
          ref={box}
          className={cn(
            "relative overflow-hidden rounded-[16px] border-[2.5px] border-ink bg-white shadow-hard-lg",
            mode === "phone" ? "h-[720px] max-h-[75dvh]" : "h-[min(78dvh,900px)] min-h-[420px]",
          )}
        >
          {!loaded ? (
            <div className="absolute inset-0 grid place-items-center bg-surface text-sm text-ink-muted" aria-hidden>
              {t.loading}
            </div>
          ) : null}
          <iframe
            key={src ?? srcDoc?.length}
            title={title}
            src={src}
            srcDoc={srcDoc}
            sandbox={LESSON_SANDBOX}
            referrerPolicy="no-referrer"
            allow="fullscreen; autoplay; clipboard-write"
            onLoad={() => setLoaded(true)}
            style={iframeStyle}
            className={cn("relative border-0 bg-white", !iframeStyle && "size-full")}
          />
        </div>
      </div>
    </div>
  );
}
