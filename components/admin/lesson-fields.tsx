"use client";

import { useI18n } from "@/components/i18n/provider";
import { Field, Input, Textarea } from "@/components/ui";

/** Title, topic, description and the published switch. Names match the Server Action form keys. */
export function LessonFields({
  title,
  onTitleChange,
  topic,
  description,
  published,
  topics = [],
  titleError,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  topic?: string | null;
  description?: string | null;
  published: boolean;
  topics?: string[];
  titleError?: string | null;
}) {
  const { dict } = useI18n();
  const t = dict.admin.fields;
  return (
    <div className="flex flex-col gap-5">
      <Field id="title" label={t.title} error={titleError}>
        <Input
          id="title"
          name="title"
          required
          maxLength={120}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "title-error" : undefined}
        />
      </Field>
      <Field id="topic" label={t.topic} optional hint={t.topicHint}>
        <Input
          id="topic"
          name="topic"
          list="topic-options"
          maxLength={40}
          defaultValue={topic ?? ""}
          autoComplete="off"
          aria-describedby="topic-hint"
        />
        <datalist id="topic-options">
          {topics.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </Field>
      <Field id="description" label={t.description} optional hint={t.descriptionHint}>
        <Textarea
          id="description"
          name="description"
          maxLength={500}
          defaultValue={description ?? ""}
          aria-describedby="description-hint"
        />
      </Field>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[12px] border-2 border-ink bg-paper px-3.5 py-3 transition-colors duration-150 has-checked:bg-mint has-focus-visible:shadow-[4px_4px_0_var(--accent)]">
        <input
          type="checkbox"
          name="published"
          defaultChecked={published}
          className="mt-0.5 size-6 shrink-0 accent-(--accent) focus-visible:outline-none"
        />
        <span>
          <span className="block text-base font-bold text-ink">{t.published}</span>
          <span className="block text-sm text-ink-muted">{t.publishedHint}</span>
        </span>
      </label>
    </div>
  );
}
