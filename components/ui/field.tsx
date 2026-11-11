import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

const control =
  "w-full rounded-[12px] border-2 border-ink bg-surface px-3.5 text-base text-ink " +
  "placeholder:text-ink-muted transition-[box-shadow,background-color,border-color] duration-150 ease-(--ease-out) " +
  // Focus = border and hard shadow turn tomato. Never a separate outline ring.
  "focus:border-accent focus:bg-white focus:shadow-hard-accent focus:outline-none focus-visible:outline-none " +
  "aria-invalid:border-danger aria-invalid:bg-danger-soft disabled:opacity-60";

/** Label above, hint below, error below that (caller wires aria-describedby to `${id}-hint` / `${id}-error`). */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-ink-muted">(optional)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn(control, "min-h-11", className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(control, "min-h-24 py-2.5 leading-relaxed", className)} />;
}
