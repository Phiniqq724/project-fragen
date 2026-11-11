import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, hasLocale, LOCALE_COOKIE, localizePath, type Locale } from "./config";
import { dictionaryFor } from "./dictionary";

/**
 * Locale for Server Actions and other places where root params are not available.
 * proxy.ts sets the cookie on every localized page view, so it matches the page the
 * action was sent from.
 */
export async function localeFromCookie(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return hasLocale(value) ? value : defaultLocale;
}

/** Dictionary for Server Actions (error messages). */
export async function actionDictionary() {
  const locale = await localeFromCookie();
  return { ...dictionaryFor(locale), locale };
}

/** Localized path for redirect() inside Server Actions. */
export async function localizedRedirectPath(path: string) {
  return localizePath(await localeFromCookie(), path);
}
