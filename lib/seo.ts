import { locales, type Locale } from "./i18n/config";

/**
 * Public origin used for canonical URLs, hreflang, sitemap and share images.
 * NEXT_PUBLIC_SITE_URL wins (set it once you have a custom domain); on Vercel the
 * production domain is picked up automatically; locally it falls back to :3000.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = { en: "en_GB", de: "de_DE", id: "id_ID" };

/**
 * canonical + hreflang for a page that exists in every language.
 * `path` is the unprefixed path ("/" or "/l/slug"). x-default points at the
 * unprefixed URL, which redirects each visitor to their own language.
 */
export function alternatesFor(locale: Locale, path: string) {
  const suffix = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${suffix}`])),
      "x-default": path,
    },
  };
}

/** Base Open Graph fields to spread into page-level openGraph (it replaces the layout's). */
export function ogBase(locale: Locale) {
  return {
    siteName: "Fragen",
    locale: ogLocales[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
