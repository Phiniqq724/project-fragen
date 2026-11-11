import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import { adminMessages, type AdminMessages } from "./messages/admin";
import { common, type CommonMessages } from "./messages/common";
import { publicMessages, type PublicMessages } from "./messages/public";

export type Dictionary = {
  common: CommonMessages;
  public: PublicMessages;
  admin: AdminMessages;
};

export function dictionaryFor(locale: Locale): Dictionary {
  return { common: common[locale], public: publicMessages[locale], admin: adminMessages[locale] };
}

/** Current locale from the `[lang]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** Dictionary for the current request. Server Components only (not Server Actions / Route Handlers). */
export async function getDictionary(): Promise<Dictionary & { locale: Locale }> {
  const locale = await getLocale();
  return { ...dictionaryFor(locale), locale };
}
