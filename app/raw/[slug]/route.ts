import { getPublishedLessonHtml } from "@/lib/lessons";
import { LESSON_SANDBOX, prepareLessonHtml } from "@/lib/lesson-html";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Serves a lesson's HTML as a real web page. The CSP `sandbox` header gives it an
 * opaque origin even when opened directly (the "Open full screen" link on phones),
 * so lesson scripts can never touch this site's cookies or storage.
 */
export async function GET(_request: Request, ctx: RouteContext<"/raw/[slug]">) {
  const { slug } = await ctx.params;
  if (!isSupabaseConfigured()) return new Response("Not configured", { status: 503 });

  const html = await getPublishedLessonHtml(slug);
  if (html === null) return new Response("Lesson not found", { status: 404 });

  return new Response(prepareLessonHtml(html), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": `sandbox ${LESSON_SANDBOX}`,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
