import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, hasLocale, LOCALE_COOKIE, SHORT_CODE, type Locale } from "./lib/i18n/config";
import { getSupabaseEnv } from "./lib/supabase/env";

const YEAR = 60 * 60 * 24 * 365;

/**
 * 1. Short links: /<code> (e.g. /k3x9q) is rewritten to /go/<code>, which redirects
 *    to the lesson in the visitor's language.
 * 2. Language: every page lives under /de, /en or /id. Unprefixed URLs (old links,
 *    /l/<slug>) redirect to the visitor's language: their last choice (cookie), else
 *    German. Browser language is ignored on purpose: it is a German class.
 * 3. Teacher routes: refresh the Supabase session, bounce signed-out visitors from
 *    /<lang>/admin to /<lang>/login and signed-in ones from login to admin.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (!hasLocale(first)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale: Locale = hasLocale(saved) ? saved : defaultLocale;

    if (SHORT_CODE.test(first) && pathname === `/${first}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/go/${first}`;
      url.search = `?lang=${locale}`;
      return NextResponse.rewrite(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  const locale = first;
  const rest = pathname.slice(locale.length + 1) || "/";
  const isTeacherRoute = rest === "/login" || rest === "/admin" || rest.startsWith("/admin/");

  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();

  if (isTeacherRoute && env) {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          for (const { name, value } of toSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
        },
      },
    });
    const { data } = await supabase.auth.getUser();

    if (!data.user && rest.startsWith("/admin")) {
      response = redirectKeepingCookies(request, response, `/${locale}/login`);
    } else if (data.user && rest === "/login") {
      response = redirectKeepingCookies(request, response, `/${locale}/admin`);
    }
  }

  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: YEAR, sameSite: "lax" });
  }
  return response;
}

/** Redirect while carrying over any refreshed auth cookies. */
function redirectKeepingCookies(request: NextRequest, from: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  // Everything except Next internals, the sandboxed lesson files, icons and other static files.
  matcher: ["/((?!_next/|raw/|go/|icon|apple-icon|favicon|.*\\.[a-zA-Z0-9]+$).*)"],
};
