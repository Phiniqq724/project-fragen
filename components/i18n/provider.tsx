"use client";

import { createContext, use, type ReactNode } from "react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

const I18nContext = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

/** Set once in app/[lang]/layout.tsx so Client Components can read the dictionary. */
export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext value={{ locale, dict }}>{children}</I18nContext>;
}

export function useI18n() {
  const value = use(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

/** Client-side helper: href("/admin") -> "/de/admin". */
export function useHref() {
  const { locale } = useI18n();
  return (path: string) => localizePath(locale, path);
}
