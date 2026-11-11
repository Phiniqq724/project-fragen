"use client";

import { LocalLink } from "@/components/i18n/link";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "./cn";

/** "Fragen" + a tilted tomato "?" sticker. Fragen means "questions". */
export function Wordmark({ href = "/", suffix, className }: { href?: string; suffix?: string; className?: string }) {
  const { dict } = useI18n();
  return (
    <LocalLink
      href={href}
      aria-label={suffix ? `Fragen ${suffix}` : dict.common.homeLabel}
      className={cn("group inline-flex min-h-11 items-center gap-2 text-ink", className)}
    >
      <span className="inline-flex items-center font-display text-2xl leading-none font-extrabold tracking-tight">
        Fragen
        <span
          aria-hidden
          className="ml-1 inline-grid h-[26px] w-6 rotate-[8deg] place-items-center rounded-[8px] border-2 border-ink bg-accent text-[19px] text-accent-ink shadow-[2px_2px_0_var(--ink)] transition-transform duration-200 ease-(--ease-out) group-hover:rotate-[-6deg]"
        >
          ?
        </span>
      </span>
      {suffix ? (
        <span className="rounded-full border-2 border-ink bg-sky px-2 py-0.5 text-xs font-semibold">{suffix}</span>
      ) : null}
    </LocalLink>
  );
}
