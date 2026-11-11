import type { ReactNode } from "react";
import { cn } from "./cn";

type Tone = "info" | "success" | "danger";

const tones: Record<Tone, string> = {
  info: "bg-surface",
  success: "bg-success-soft",
  danger: "bg-danger-soft",
};

/** Sticker-style status message for empty, error, success and setup states. */
export function Notice({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("sticker px-5 py-4", tones[tone], className)}>
      <p className="font-display text-xl font-extrabold tracking-tight">{title}</p>
      {children ? <div className="mt-1 text-[0.9375rem] text-ink-muted">{children}</div> : null}
      {action ? <div className="mt-4 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
