import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getPublishedLessons, type Lesson } from "@/lib/lessons";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { siteUrl } from "@/lib/seo";

/** Every public page in every language, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  let lessons: Lesson[] = [];
  if (isSupabaseConfigured()) {
    try {
      lessons = await getPublishedLessons();
    } catch {
      lessons = [];
    }
  }

  const entry = (path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: path ? "monthly" : "weekly",
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
    }));

  return [
    ...entry("", lessons[0]?.updated_at, 1),
    ...lessons.flatMap((lesson) => entry(`/l/${lesson.slug}`, lesson.updated_at)),
  ];
}
