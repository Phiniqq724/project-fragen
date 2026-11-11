"use client";

import { LocalLink } from "@/components/i18n/link";
import { useI18n } from "@/components/i18n/provider";
import { useMemo, useState } from "react";
import { TopicChip, TopicChipButton } from "@/components/ui";
import { formatDay } from "@/lib/format";

export type LessonRow = {
  slug: string;
  title: string;
  description: string | null;
  topic: string | null;
  created_at: string;
};

// Alternating fills with a tiny static tilt.
const STYLES = ["bg-surface", "bg-sky rotate-[0.6deg]", "bg-pink -rotate-[0.5deg]"];

export function LessonList({ lessons }: { lessons: LessonRow[] }) {
  const { dict, locale } = useI18n();
  const t = dict.public;
  const [topic, setTopic] = useState<string | null>(null);
  const topics = useMemo(
    () => Array.from(new Set(lessons.map((l) => l.topic).filter((t): t is string => !!t))).sort((a, b) => a.localeCompare(b)),
    [lessons],
  );
  const visible = topic ? lessons.filter((l) => l.topic === topic) : lessons;

  return (
    <div>
      {topics.length > 0 ? (
        <div role="group" aria-label={t.filterByTopic} className="flex flex-wrap gap-2 pb-6">
          <TopicChipButton selected={topic === null} onClick={() => setTopic(null)}>
            {t.all}
          </TopicChipButton>
          {topics.map((t) => (
            <TopicChipButton key={t} selected={topic === t} onClick={() => setTopic(t)}>
              {t}
            </TopicChipButton>
          ))}
        </div>
      ) : null}
      <ul className="flex flex-col gap-4">
        {visible.map((l, i) => (
          <li key={l.slug}>
            <LocalLink
              href={`/l/${l.slug}`}
              className={`sticker block min-h-11 px-5 py-4 transition-[box-shadow,transform] duration-150 ease-(--ease-out) hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${STYLES[i % 3]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold tracking-tight text-ink [overflow-wrap:anywhere] sm:text-2xl">
                  {l.title}
                </h2>
                <time
                  dateTime={l.created_at}
                  className="shrink-0 rounded-[8px] border-2 border-ink bg-sun px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-ink"
                >
                  {formatDay(l.created_at, locale)}
                </time>
              </div>
              {l.description ? (
                <p className="mt-2 line-clamp-2 text-base text-ink-muted [overflow-wrap:anywhere]">{l.description}</p>
              ) : null}
              {l.topic ? (
                <p className="mt-3">
                  <TopicChip>{l.topic}</TopicChip>
                </p>
              ) : null}
            </LocalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Loading placeholder that matches the sticker rows. */
export function LessonListSkeleton({ label }: { label: string }) {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="sticker px-5 py-4">
          <div className="h-6 w-3/5 rounded-[6px] bg-ink/10" />
          <div className="mt-3 h-4 w-11/12 rounded-[6px] bg-ink/10" />
          <div className="mt-4 h-6 w-20 rounded-full bg-ink/10" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
