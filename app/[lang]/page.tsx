import { Suspense } from "react";
import { Notice, PageHeading, SiteShell, StickerTitle } from "@/components/ui";
import { LessonList, LessonListSkeleton, type LessonRow } from "@/components/public/lesson-list";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPublishedLessons } from "@/lib/lessons";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
  const { public: t } = await getDictionary();
  return (
    <SiteShell>
      <PageHeading title={<StickerTitle heading={t.home.heading} />} lead={t.home.lead} />
      <Suspense fallback={<LessonListSkeleton label={t.loadingLessons} />}>
        <Lessons />
      </Suspense>
    </SiteShell>
  );
}
