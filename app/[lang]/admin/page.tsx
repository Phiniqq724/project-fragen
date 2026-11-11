import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink, Notice, PageHeading, TopicChip, IconEdit, IconUpload, IconView } from "@/components/ui";
import { formatDay as formatShortDate, formatDayLong as formatLongDate } from "@/lib/format";
import { requireTeacher } from "@/lib/auth";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Lesson } from "@/lib/lessons";

export async function generateMetadata(): Promise<Metadata> {
  const { admin } = await getDictionary();
  return { title: admin.list.title, robots: { index: false } };
}


// Alternating fills with a tiny static tilt, same as the student list.
const STYLES = ["bg-surface", "bg-sky rotate-[0.6deg]", "bg-pink -rotate-[0.5deg]"];

export default async function AdminPage() {
  const { admin } = await getDictionary();
  const t = admin.list;
  return (
    <>
      <PageHeading
        title={
          <>
            {t.heading.before}
            <span className="sticker-word">{t.heading.word}</span>
            {t.heading.after}
          </>
        }
        lead={t.lead}
        actions={<ButtonLink href="/admin/new" icon={<IconUpload />}>{admin.uploadLesson}</ButtonLink>}
      />
      <Suspense fallback={<ListSkeleton />}>
        <LessonRows />
      </Suspense>
    </>
  );
}

async function ListSkeleton() {
  const { admin } = await getDictionary();
  return (
    <div role="status" aria-label={admin.list.loadingLessons} className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="sticker px-5 py-4">
          <div className="h-5 w-2/3 rounded-[6px] bg-ink/10" />
          <div className="mt-2 h-4 w-1/3 rounded-[6px] bg-ink/10" />
        </div>
      ))}
      <span className="sr-only">{admin.list.loadingLessons}</span>
    </div>
  );
}

async function LessonRows() {
  const { supabase } = await requireTeacher();
  const { admin, locale } = await getDictionary();
  const t = admin.list;
  const { data, error } = await supabase
    .from("lessons")
    .select("id, slug, code, title, topic, published, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <Notice tone="danger" title={t.loadError.title}>
        {t.loadError.body}
      </Notice>
    );
  }
  const lessons = (data ?? []) as Pick<Lesson, "id" | "slug" | "code" | "title" | "topic" | "published" | "created_at">[];

  if (lessons.length === 0) {
    return (
      <Notice
        title={t.empty.title}
        action={<ButtonLink href="/admin/new" icon={<IconUpload />}>{admin.uploadFirst}</ButtonLink>}
      >
        {t.empty.body}
      </Notice>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {lessons.map((l, i) => (
        <li
          key={l.id}
          className={`sticker flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${STYLES[i % 3]}`}
        >
          <div className="min-w-0">
            <p className="font-display text-xl font-bold break-words">{l.title}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
              <span
                className={`rounded-full border-2 border-ink px-2.5 py-px text-xs font-semibold text-ink ${
                  l.published ? "bg-mint" : "border-dashed bg-surface"
                }`}
              >
                {l.published ? t.published : t.hidden}
              </span>
              {l.topic ? <TopicChip>{l.topic}</TopicChip> : null}
              <time dateTime={l.created_at} title={formatLongDate(l.created_at, locale)}>
                {formatShortDate(l.created_at, locale)}
              </time>
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            {l.published ? <CopyLinkButton code={l.code} lessonTitle={l.title} iconOnly /> : null}
            <ButtonLink href={`/admin/${l.id}`} variant="secondary" size="sm" icon={<IconEdit />}>
              {t.edit}<span className="sr-only"> {l.title}</span>
            </ButtonLink>
            {l.published ? (
              <ButtonLink href={`/l/${l.slug}`} variant="secondary" size="sm" icon={<IconView />}>
                {t.view}<span className="sr-only"> {l.title}</span>
              </ButtonLink>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
