import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink, ButtonLink, LessonFrame, Notice, SiteShell, TopicChip } from "@/components/ui";
import { formatDayLong } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPublishedLessonBySlug } from "@/lib/lessons";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { alternatesFor, jsonLd, ogBase, siteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/l/[slug]">): Promise<Metadata> {
  const [{ slug }, { public: t, locale }] = await Promise.all([params, getDictionary()]);
  if (!isSupabaseConfigured()) return { title: t.lessonTitleFallback };
  try {
    const lesson = await getPublishedLessonBySlug(slug);
    if (!lesson) return { title: t.lessonNotFoundTitle, robots: { index: false } };
    const description = lesson.description ?? t.seo.lessonDescription;
    return {
      title: lesson.title,
      description,
      alternates: alternatesFor(locale, `/l/${lesson.slug}`),
      openGraph: {
        ...ogBase(locale),
        type: "article",
        title: lesson.title,
        description,
        url: `/${locale}/l/${lesson.slug}`,
        publishedTime: lesson.created_at,
        modifiedTime: lesson.updated_at,
        tags: lesson.topic ? [lesson.topic] : undefined,
      },
    };
  } catch {
    return { title: t.lessonTitleFallback };
  }
}

async function Lesson({ params }: { params: PageProps<"/[lang]/l/[slug]">["params"] }) {
  const [{ slug }, { common, public: t, locale }] = await Promise.all([params, getDictionary()]);
  if (!isSupabaseConfigured()) {
    return <Notice title={common.notConnected.title}>{common.notConnected.body}</Notice>;
  }
  const lesson = await getPublishedLessonBySlug(slug);
  if (!lesson) notFound();

  const src = `/raw/${encodeURIComponent(lesson.slug)}`;
  const url = `${siteUrl()}/${locale}/l/${lesson.slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LearningResource",
              name: lesson.title,
              description: lesson.description ?? t.seo.lessonDescription,
              url,
              learningResourceType: "Lesson",
              about: lesson.topic ?? undefined,
              teaches: "German language",
              isAccessibleForFree: true,
              datePublished: lesson.created_at,
              dateModified: lesson.updated_at,
              inLanguage: "de",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: common.allLessons, item: `${siteUrl()}/${locale}` },
                { "@type": "ListItem", position: 2, name: lesson.title, item: url },
              ],
            },
          ],
        })}
      />
      <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight [overflow-wrap:anywhere] sm:text-5xl">
        {lesson.title}
      </h1>
      {lesson.description ? (
        <p className="mt-4 max-w-prose text-base text-ink-muted [overflow-wrap:anywhere]">{lesson.description}</p>
      ) : null}

      {/* Toolbar sits directly on top of the lesson: meta left, full screen right. */}
      <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-ink">
          {lesson.topic ? <TopicChip>{lesson.topic}</TopicChip> : null}
          <time dateTime={lesson.created_at}>{formatDayLong(lesson.created_at, locale)}</time>
        </p>
        <ButtonLink href={src} target="_blank" rel="noopener" size="sm">
          {t.openFullScreen}
          <span aria-hidden className="text-base leading-none">
            ↗
          </span>
        </ButtonLink>
      </div>
      <LessonFrame title={lesson.title} src={src} />
    </>
  );
}

function LessonSkeleton({ label }: { label: string }) {
  return (
    <div aria-hidden>
      <div className="h-11 w-2/3 rounded-[8px] bg-ink/10" />
      <div className="mt-8 mb-4 flex justify-between">
        <div className="h-7 w-40 rounded-full bg-ink/10" />
        <div className="h-10 w-40 rounded-[12px] bg-ink/10" />
      </div>
      <div className="sticker h-[60dvh]" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default async function LessonPage(props: PageProps<"/[lang]/l/[slug]">) {
  const { common } = await getDictionary();
  return (
    <SiteShell>
      <BackLink href="/">{common.allLessons}</BackLink>
      <Suspense fallback={<LessonSkeleton label={common.frame.loading} />}>
        <Lesson params={props.params} />
      </Suspense>
    </SiteShell>
  );
}
