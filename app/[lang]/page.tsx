import type { Metadata } from "next";
import { Suspense } from "react";
import { Notice, PageHeading, SiteShell, StickerTitle } from "@/components/ui";
import { LessonList, LessonListSkeleton, type LessonRow } from "@/components/public/lesson-list";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPublishedLessons } from "@/lib/lessons";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { alternatesFor, jsonLd, ogBase, siteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { common, public: t, locale } = await getDictionary();
  return {
    title: { absolute: t.seo.homeTitle },
    description: common.tagline,
    alternates: alternatesFor(locale, "/"),
    openGraph: { ...ogBase(locale), type: "website", title: t.seo.homeTitle, description: common.tagline, url: `/${locale}` },
  };
}

async function Lessons() {
  const { common, public: t } = await getDictionary();
  if (!isSupabaseConfigured()) {
    return <Notice title={common.notConnected.title}>{common.notConnected.body}</Notice>;
  }

  let lessons: LessonRow[];
  try {
    lessons = (await getPublishedLessons()).map(({ slug, title, description, topic, created_at }) => ({
      slug,
      title,
      description,
      topic,
      created_at,
    }));
  } catch {
    return (
      <Notice tone="danger" title={t.loadError.title}>
        {t.loadError.body}
      </Notice>
    );
  }

  if (lessons.length === 0) {
    return <Notice title={t.empty.title}>{t.empty.body}</Notice>;
  }
  return <LessonList lessons={lessons} />;
}

export default async function Home() {
  const { common, public: t, locale } = await getDictionary();
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Fragen",
          url: `${siteUrl()}/${locale}`,
          inLanguage: locale,
          description: common.tagline,
        })}
      />
      <PageHeading title={<StickerTitle heading={t.home.heading} />} lead={t.home.lead} />
      <Suspense fallback={<LessonListSkeleton label={t.loadingLessons} />}>
        <Lessons />
      </Suspense>
    </SiteShell>
  );
}
