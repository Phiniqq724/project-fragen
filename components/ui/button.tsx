import { LocalLink } from "@/components/i18n/link";
import type { ComponentProps } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "danger";
type Size = "md" | "sm";

// Sticker buttons: ink outline + hard shadow. Hover lifts, press pushes the sticker flat into the page.
const sticker =
  "border-2 border-ink shadow-hard-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--ink)] " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,color,box-shadow,transform] duration-150 ease-(--ease-out) " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: cn(sticker, "bg-accent text-accent-ink hover:bg-accent-hover"),
  secondary: cn(sticker, "bg-surface text-ink hover:bg-sun"),
  danger: cn(sticker, "bg-danger-soft text-danger hover:bg-[#ffd0c7]"),
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-[0.9375rem]",
  sm: "min-h-11 px-3.5 text-sm sm:min-h-10",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  pending,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; pending?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || pending}
      aria-busy={pending || undefined}
      className={buttonClass(variant, size, className)}
    >
      {pending ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof LocalLink> & { variant?: Variant; size?: Size }) {
  // Internal hrefs get the current language prefix automatically.
  return <LocalLink {...props} className={buttonClass(variant, size, className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      fill="none"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
