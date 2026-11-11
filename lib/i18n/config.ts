export const locales = ["en", "de", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie that remembers the last language a visitor used. Set by proxy.ts. */
export const LOCALE_COOKIE = "fragen_lang";

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Full names, each written in its own language, for the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  id: "Bahasa Indonesia",
};

/** Intl locale used for dates. */
export const dateLocales: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  id: "id-ID",
};

/** Paths that are never language-prefixed (served outside app/[lang]). */
const UNLOCALIZED = /^\/(raw|icon|apple-icon|_next)(\/|\.|\?|$)/;

/**
 * "/admin" + "de" -> "/de/admin". Leaves alone: external URLs, hash/relative links,
 * paths that already carry a locale, and unlocalized routes like /raw/<slug>.
 */
export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || UNLOCALIZED.test(path)) return path;
  if (hasLocale(path.split(/[/?#]/)[1])) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swap the locale prefix of a pathname: "/de/l/x" + "id" -> "/id/l/x". */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const parts = pathname.split("/");
  if (hasLocale(parts[1])) parts[1] = locale;
  else parts.splice(1, 0, locale);
  return parts.join("/").replace(/\/$/, "") || `/${locale}`;
}

/** Best match for an Accept-Language header, or null. */
export function matchAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (base === "in") return "id"; // legacy code for Indonesian
    if (hasLocale(base)) return base;
  }
  return null;
}

/** Tiny "{name}" interpolation for message strings. */
export function fmt(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
