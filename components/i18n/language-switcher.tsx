"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { locales, localeNames, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/components/ui/cn";
import { useI18n } from "./provider";

/**
 * EN / DE / ID pill in the header. Plain links: proxy.ts remembers the choice in a cookie.
 * Reading the pathname is request data, so it streams in behind Suspense; until then the
 * pill links to each language's home page.
 */
export function LanguageSwitcher() {
  return (
    <Suspense fallback={<Pill hrefFor={(l) => `/${l}`} />}>
      <PathAwarePill />
    </Suspense>
  );
}

function PathAwarePill() {
  const pathname = usePathname();
  return <Pill hrefFor={(l) => switchLocalePath(pathname, l)} />;
}

function Pill({ hrefFor }: { hrefFor: (locale: Locale) => string }) {
  const { locale, dict } = useI18n();
  return (
    <nav aria-label={dict.common.language} className="inline-flex gap-0.5 rounded-full border-2 border-ink bg-surface p-0.5">
      {locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          hrefLang={l}
          lang={l}
          aria-label={localeNames[l]}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "inline-grid min-h-10 min-w-10 place-items-center rounded-full px-2 text-xs font-bold uppercase transition-colors duration-150",
            l === locale ? "bg-ink text-sun" : "text-ink hover:bg-sky",
          )}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
