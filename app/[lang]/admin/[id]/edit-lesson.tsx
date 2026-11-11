"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { Button, LessonFrame, Notice, PageHeading } from "@/components/ui";
import { FileDrop } from "@/components/admin/file-drop";
import { LessonFields } from "@/components/admin/lesson-fields";
import { useI18n } from "@/components/i18n/provider";
import { fmt } from "@/lib/i18n/config";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { LESSON_BUCKET } from "@/lib/supabase/env";
import { prepareLessonHtml } from "@/lib/lesson-html";
import type { Lesson } from "@/lib/lessons";
import { deleteLesson, replaceLessonFile, updateLesson, type FormState } from "../actions";

const idle: FormState = { error: null };

export function EditLesson({ lesson, srcDoc, saved }: { lesson: Lesson; srcDoc: string | null; saved: boolean }) {
  const { dict } = useI18n();
  const t = dict.admin.edit;
  const [title, setTitle] = useState(lesson.title);
  const [state, action, pending] = useActionState(updateLesson, idle);
  const [topics, setTopics] = useState<string[]>([]);

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

  return (
    <>
      <PageHeading
        back={{ href: "/admin", label: dict.admin.back }}
        title={
          <>
            {t.heading.before}
            <span className="sticker-word">{t.heading.word}</span>
            {t.heading.after}
          </>
        }
        lead={<span className="font-semibold text-ink">{lesson.title}</span>}
      />
      {saved ? <SavedNotice lesson={lesson} /> : null}

      <section aria-labelledby="preview-heading" className={`${saved ? "mt-10" : ""} flex flex-col gap-3`}>
        <h2 id="preview-heading" className="font-display text-xl font-bold">
          {t.currentFile}
        </h2>
        {srcDoc ? (
          <LessonFrame srcDoc={srcDoc} showDeviceToggle title={fmt(t.currentFileTitle, { title: lesson.title })} />
        ) : (
          <Notice tone="danger" title={t.fileUnreadable.title}>
            {t.fileUnreadable.body}
          </Notice>
        )}
      </section>

      <form
        action={action}
        className="sticker mt-10 flex flex-col gap-5 p-5 sm:p-6"
      >
        <h2 className="font-display text-xl font-bold">{t.details}</h2>
        <input type="hidden" name="id" value={lesson.id} />
        <LessonFields
          title={title}
          onTitleChange={setTitle}
          topic={lesson.topic}
          description={lesson.description}
          published={lesson.published}
          topics={topics}
        />
        {state.error ? (
          <p role="alert" className="text-sm font-semibold text-danger">
            {state.error}
          </p>
        ) : null}
        <div>
          <Button type="submit" pending={pending}>
            {pending ? t.savingChanges : t.saveChanges}
          </Button>
        </div>
      </form>

      <ReplaceFile lesson={lesson} />
      <DeleteLesson lesson={lesson} />
    </>
  );
}

function SavedNotice({ lesson }: { lesson: Lesson }) {
  const { dict } = useI18n();
  const t = dict.admin.edit.saved;
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  // Deliberately no language prefix: each student opens the link in their own language.
  const url = `${origin}/l/${lesson.slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Notice
      tone="success"
      title={t.title}
      action={
        lesson.published ? (
          <Button type="button" variant="secondary" size="sm" onClick={copy}>
            {copied ? t.linkCopied : t.copyLink}
          </Button>
        ) : null
      }
    >
      {lesson.published ? (
        <p>
          {t.published} <span className="font-semibold break-all text-ink">{url}</span>
        </p>
      ) : (
        <p>{t.hidden}</p>
      )}
    </Notice>
  );
}

function ReplaceFile({ lesson }: { lesson: Lesson }) {
  const { dict } = useI18n();
  const t = dict.admin.edit.replace;
  const [file, setFile] = useState<File | null>(null);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function pick(next: File) {
    setError(null);
    setSrcDoc(prepareLessonHtml(await next.text()));
    setFile(next);
  }

  function save() {
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const storagePath = `${crypto.randomUUID()}.html`;
      const { error: uploadError } = await createBrowserSupabase()
        .storage.from(LESSON_BUCKET)
        .upload(storagePath, file, { contentType: "text/html", upsert: false });
      if (uploadError) {
        setError(t.uploadFailed);
        return;
      }
      const result = await replaceLessonFile({
        id: lesson.id,
        storagePath,
        fileName: file.name,
        fileSize: file.size,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <section aria-labelledby="replace-heading" className="mt-10 flex flex-col gap-3">
      <h2 id="replace-heading" className="font-display text-xl font-bold">
        {t.heading}
      </h2>
      <p className="text-sm text-ink-muted">{t.hint}</p>
      <FileDrop id="replace-file" fileName={file?.name} onFile={pick} onError={setError} describedBy={error ? "replace-error" : undefined} />
      {error ? (
        <p id="replace-error" role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
      {srcDoc ? (
        <>
          <LessonFrame srcDoc={srcDoc} showDeviceToggle title={t.previewTitle} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} pending={pending}>
              {pending ? t.replacing : t.button}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                setFile(null);
                setSrcDoc(null);
              }}
            >
              {t.discard}
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}

function DeleteLesson({ lesson }: { lesson: Lesson }) {
  const { dict } = useI18n();
  const t = dict.admin.edit.delete;
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(deleteLesson, idle);

  return (
    <section aria-labelledby="delete-heading" className="mt-10 border-t-2 border-dashed border-ink pt-8">
      <h2 id="delete-heading" className="font-display text-xl font-bold">
        {t.heading}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">{t.hint}</p>
      <Button type="button" variant="danger" className="mt-4" onClick={() => dialog.current?.showModal()}>
        {t.button}
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto w-[min(28rem,calc(100%-2rem))] sticker p-6 text-ink backdrop:bg-ink/40"
      >
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={lesson.id} />
          <h2 id="delete-title" className="font-display text-xl font-bold break-words">
            {t.dialogTitle}
          </h2>
          <p className="text-[0.9375rem] text-ink-muted">
            <span className="font-medium text-ink">{lesson.title}</span>
            {t.dialogBodyAfter}
          </p>
          {state.error ? (
            <p role="alert" className="text-sm font-semibold text-danger">
              {state.error}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => dialog.current?.close()}>
              {t.keep}
            </Button>
            <Button type="submit" variant="danger" pending={pending}>
              {pending ? t.deleting : t.button}
            </Button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
