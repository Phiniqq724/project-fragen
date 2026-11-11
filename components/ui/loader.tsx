import { cn } from "./cn";

/**
 * Spinning loading indicator: faint ink ring with a tomato arc. The text label is for
 * screen readers only. Under reduced motion the global rule freezes it as a static arc.
 */
export function Loader({ label, className }: { label: string; className?: string }) {
  return (
    <div role="status" className={cn("grid place-items-center py-16", className)}>
      <svg aria-hidden viewBox="0 0 36 36" className="size-10 animate-spin" fill="none">
        <circle cx="18" cy="18" r="14" stroke="var(--ink)" strokeOpacity="0.15" strokeWidth="4" />
        <path d="M32 18A14 14 0 0 0 18 4" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
