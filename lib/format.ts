import { dateLocales, type Locale } from "./i18n/config";

// UTC so server and client always agree.
const short = new Map<Locale, Intl.DateTimeFormat>();
const long = new Map<Locale, Intl.DateTimeFormat>();

/** "12 Nov" / "12. Nov." / "12 Nov". */
export function formatDay(iso: string, locale: Locale = "en") {
  if (!short.has(locale)) short.set(locale, new Intl.DateTimeFormat(dateLocales[locale], { day: "numeric", month: "short", timeZone: "UTC" }));
  return short.get(locale)!.format(new Date(iso));
}

/** "12 November 2026" in the given language. */
export function formatDayLong(iso: string, locale: Locale = "en") {
  if (!long.has(locale)) long.set(locale, new Intl.DateTimeFormat(dateLocales[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }));
  return long.get(locale)!.format(new Date(iso));
}
