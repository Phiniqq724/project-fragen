import { defaultLocale, hasLocale } from "@/lib/i18n/config";
import { dictionaryFor } from "@/lib/i18n/dictionary";
import { getPublishedLessonBySlug } from "@/lib/lessons";
import { OG_SIZE, renderShareCard } from "@/lib/og";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Fragen lesson";

/** Per-lesson share card: what students see when a teacher drops the link in a group chat. */
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const { public: t } = dictionaryFor(hasLocale(lang) ? lang : defaultLocale);
  const lesson = isSupabaseConfigured() ? await getPublishedLessonBySlug(slug).catch(() => null) : null;
  return renderShareCard({
    eyebrow: lesson?.topic ?? t.seo.cardEyebrow,
    title: lesson?.title ?? t.seo.siteCardTitle,
    footer: t.seo.cardFooter,
  });
}
