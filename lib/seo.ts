import { locales, type Locale } from "./i18n/config";

/** The public site. Canonical URLs, sitemap and share cards always point here in production. */
export const PRODUCTION_URL = "https://fragen.sndyy.id";

/**
 * Public origin used for canonical URLs, hreflang, sitemap and share images.
 * NEXT_PUBLIC_SITE_URL overrides; any Vercel deployment (production or preview) uses
 * fragen.sndyy.id so previews never compete with the real site; locally it is :3000.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL) return PRODUCTION_URL;
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
