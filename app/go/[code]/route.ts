import { NextResponse } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, SHORT_CODE } from "@/lib/i18n/config";
import { getPublishedSlugByCode } from "@/lib/lessons";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Short share links. proxy.ts rewrites /k3x9q to /go/k3x9q?lang=<visitor's language>;
 * this sends the visitor on to the full lesson page (/de/l/<slug>), which stays the
 * canonical, indexable URL. Unknown or hidden codes land on the localized 404 page.
 */
export async function GET(request: Request, ctx: RouteContext<"/go/[code]">) {
  const { code } = await ctx.params;
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("lang");
  const fromCookie = request.headers.get("cookie")?.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([a-z]+)`))?.[1];
  const lang = hasLocale(fromQuery) ? fromQuery : hasLocale(fromCookie) ? fromCookie : defaultLocale;

  let slug: string | null = null;
  if (SHORT_CODE.test(code) && isSupabaseConfigured()) {
    try {
      slug = await getPublishedSlugByCode(code);
    } catch {
      slug = null;
    }
  }

  const target = new URL(slug ? `/${lang}/l/${slug}` : `/${lang}/${code}`, url.origin);
  return NextResponse.redirect(target, 307);
}
