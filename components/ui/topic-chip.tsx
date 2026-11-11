import type { ComponentProps } from "react";
import { cn } from "./cn";

/** Topic tag on a lesson: tomato pill with white text. */
export function TopicChip({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Filter chip. Selected = ink fill with sun text. */
export function TopicChipButton({
  selected,
  className,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border-2 border-ink px-4 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-(--ease-out) active:scale-[0.96] sm:min-h-10",
        selected ? "bg-ink text-sun focus-visible:shadow-[3px_3px_0_var(--accent)]" : "bg-surface text-ink hover:bg-sky focus-visible:bg-sky",
        className,
      )}
    />
  );
}
