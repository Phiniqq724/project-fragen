"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button, ButtonLink, LessonFrame, Notice, PageHeading, IconCheck, IconClose } from "@/components/ui";
import { FileDrop } from "@/components/admin/file-drop";
import { LessonFields } from "@/components/admin/lesson-fields";
import { useI18n } from "@/components/i18n/provider";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { LESSON_BUCKET } from "@/lib/supabase/env";
import { extractHtmlTitle, prepareLessonHtml } from "@/lib/lesson-html";
import { createLesson } from "../actions";

export default function NewLessonPage() {
  const { dict } = useI18n();
  const t = dict.admin.upload;
  const [file, setFile] = useState<File | null>(null);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const titleTouched = useRef(false);

  useEffect(() => {
    let cancelled = false;
    createBrowserSupabase()
      .from("lessons")
      .select("topic")
      .not("topic", "is", null)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setTopics([...new Set(data.map((r) => r.topic as string))].sort((a, b) => a.localeCompare(b)));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function pick(next: File) {
    setFileError(null);
    setFormError(null);
    const text = await next.text();
    setFile(next);
    setSrcDoc(prepareLessonHtml(text));
    if (!titleTouched.current) setTitle(extractHtmlTitle(text) ?? next.name.replace(/\.html?$/i, ""));
  }

  function submit(form: HTMLFormElement) {
    setFormError(null);
    setTitleError(null);
    if (!file) {
      setFileError(t.chooseFirst);
      return;
    }
    if (!title.trim()) {
      setTitleError(dict.admin.errors.needTitle);
      return;
    }
    const data = new FormData(form);
    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const storagePath = `${crypto.randomUUID()}.html`;
      const { error: uploadError } = await supabase.storage
        .from(LESSON_BUCKET)
        .upload(storagePath, file, { contentType: "text/html", upsert: false });
      if (uploadError) {
        setFormError(t.uploadFailed);
        return;
      }
      const result = await createLesson({
        title,
        topic: String(data.get("topic") ?? ""),
        description: String(data.get("description") ?? ""),
        published: data.get("published") === "on",
        storagePath,
        fileName: file.name,
        fileSize: file.size,
      });
      // On success the action redirects, so we only get here with an error.
      if (result?.error) setFormError(result.error);
    });
  }

  return (
    <>
      <title>{t.title}</title>
      <PageHeading
        back={{ href: "/admin", label: dict.admin.back }}
        title={
          <>
            {t.heading.before}
            <span className="sticker-word">{t.heading.word}</span>
            {t.heading.after}
          </>
        }
        lead={t.lead}
      />

      <form
        className="flex flex-col gap-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit(e.currentTarget);
        }}
      >
        <div className="flex flex-col gap-2">
          <FileDrop
            id="file"
            fileName={file?.name}
            onFile={pick}
            onError={setFileError}
            describedBy={fileError ? "file-error" : undefined}
          />
          {fileError ? (
            <p id="file-error" role="alert" className="text-sm font-semibold text-danger">
              {fileError}
            </p>
          ) : null}
        </div>

        {srcDoc ? (
          <section aria-labelledby="preview-heading" className="flex flex-col gap-3">
            <h2 id="preview-heading" className="font-display text-xl font-bold">
              {t.preview}
            </h2>
            <LessonFrame srcDoc={srcDoc} showDeviceToggle title={title || t.previewFallback} />
          </section>
        ) : null}

        <section aria-labelledby="details-heading" className="flex flex-col gap-5 sticker p-5 sm:p-6">
          <h2 id="details-heading" className="font-display text-xl font-bold">
            {t.details}
          </h2>
          <div
            onChange={(e) => {
              if ((e.target as HTMLElement).id === "title") titleTouched.current = true;
            }}
          >
            <LessonFields
              title={title}
              onTitleChange={setTitle}
              published
              topics={topics}
              titleError={titleError}
            />
          </div>
        </section>

        {formError ? (
          <Notice tone="danger" title={t.saveError}>
            {formError}
          </Notice>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" pending={pending} icon={<IconCheck />}>
            {pending ? t.saving : t.save}
          </Button>
          <ButtonLink href="/admin" variant="secondary" icon={<IconClose />}>
            {t.cancel}
          </ButtonLink>
        </div>
      </form>
    </>
  );
}
