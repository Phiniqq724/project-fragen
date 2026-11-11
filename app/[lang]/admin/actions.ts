"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireTeacher } from "@/lib/auth";
import { LESSONS_TAG } from "@/lib/lessons";
import { slugify, MAX_LESSON_BYTES } from "@/lib/lesson-html";
import { actionDictionary, localizedRedirectPath } from "@/lib/i18n/server";
import type { AdminMessages } from "@/lib/i18n/messages/admin";
import { LESSON_BUCKET } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export type FormState = { error: string | null };

const PATH_SHAPE = /^[0-9a-f-]{36}\.html$/;
const UUID_SHAPE = /^[0-9a-f-]{36}$/;

export type LessonMeta = {
  title: string;
  topic: string;
  description: string;
  published: boolean;
};

export type NewLessonInput = LessonMeta & {
  storagePath: string;
  fileName: string;
  fileSize: number;
};

function cleanMeta(raw: LessonMeta, t: AdminMessages["errors"]): { error: string } | { value: { title: string; topic: string | null; description: string | null; published: boolean } } {
  const title = String(raw.title ?? "").trim();
  const topic = String(raw.topic ?? "").trim();
  const description = String(raw.description ?? "").trim();
  if (!title) return { error: t.needTitle };
  if (title.length > 120) return { error: t.titleLong };
  if (topic.length > 40) return { error: t.topicLong };
  if (description.length > 500) return { error: t.descriptionLong };
  return { value: { title, topic: topic || null, description: description || null, published: Boolean(raw.published) } };
}

function checkFileMeta(path: string, name: string, size: number, t: AdminMessages["errors"]): string | null {
  if (!PATH_SHAPE.test(path)) return t.badPath;
  if (!name || name.length > 200) return t.badName;
  if (!Number.isFinite(size) || size <= 0 || size > MAX_LESSON_BYTES) return t.badSize;
  return null;
}

async function removeObject(supabase: Awaited<ReturnType<typeof createServerSupabase>>, path: string) {
  await supabase.storage.from(LESSON_BUCKET).remove([path]);
}

/** Called from the browser after the file reached Storage. Returns { error } or redirects. */
export async function createLesson(input: NewLessonInput): Promise<FormState> {
  const { supabase } = await requireTeacher();
  const { admin } = await actionDictionary();
  const t = admin.errors;
  const fileError = checkFileMeta(input.storagePath, input.fileName, input.fileSize, t);
  if (fileError) {
    if (PATH_SHAPE.test(input.storagePath)) await removeObject(supabase, input.storagePath);
    return { error: fileError };
  }
  const meta = cleanMeta(input, t);
  if ("error" in meta) {
    await removeObject(supabase, input.storagePath);
    return { error: meta.error };
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      ...meta.value,
      slug: slugify(meta.value.title),
      storage_path: input.storagePath,
      file_name: input.fileName,
      file_size: input.fileSize,
    })
    .select("id")
    .single();

  if (error || !data) {
    await removeObject(supabase, input.storagePath);
    return { error: t.saveFailed };
  }

  updateTag(LESSONS_TAG);
  redirect(await localizedRedirectPath(`/admin/${data.id}?saved=1`));
}

export async function updateLesson(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireTeacher();
  const { admin } = await actionDictionary();
  const t = admin.errors;
  const id = String(formData.get("id") ?? "");
  if (!UUID_SHAPE.test(id)) return { error: t.notFound };

  const meta = cleanMeta({
    title: String(formData.get("title") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    description: String(formData.get("description") ?? ""),
    published: formData.get("published") === "on",
  }, t);
  if ("error" in meta) return { error: meta.error };

  const { error } = await supabase.from("lessons").update(meta.value).eq("id", id);
  if (error) return { error: t.saveChangesFailed };

  updateTag(LESSONS_TAG);
  redirect(await localizedRedirectPath(`/admin/${id}?saved=1`));
}

export async function replaceLessonFile(input: {
  id: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
}): Promise<FormState> {
  const { supabase } = await requireTeacher();
  const { admin } = await actionDictionary();
  const t = admin.errors;
  const fileError = checkFileMeta(input.storagePath, input.fileName, input.fileSize, t);
  if (fileError) return { error: fileError };
  if (!UUID_SHAPE.test(input.id)) {
    await removeObject(supabase, input.storagePath);
    return { error: t.notFound };
  }

  const { data: current } = await supabase.from("lessons").select("storage_path").eq("id", input.id).maybeSingle();
  if (!current) {
    await removeObject(supabase, input.storagePath);
    return { error: t.notFound };
  }

  const { error } = await supabase
    .from("lessons")
    .update({ storage_path: input.storagePath, file_name: input.fileName, file_size: input.fileSize })
    .eq("id", input.id);
  if (error) {
    await removeObject(supabase, input.storagePath);
    return { error: t.replaceFailed };
  }

  if (current.storage_path !== input.storagePath) await removeObject(supabase, current.storage_path);
  updateTag(LESSONS_TAG);
  redirect(await localizedRedirectPath(`/admin/${input.id}?saved=1`));
}

export async function deleteLesson(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireTeacher();
  const { admin } = await actionDictionary();
  const t = admin.errors;
  const id = String(formData.get("id") ?? "");
  if (!UUID_SHAPE.test(id)) return { error: t.notFound };

  const { data: lesson } = await supabase.from("lessons").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { error: t.deleteFailed };

  if (lesson?.storage_path) await removeObject(supabase, lesson.storage_path);
  updateTag(LESSONS_TAG);
  redirect(await localizedRedirectPath("/admin"));
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect(await localizedRedirectPath("/"));
}
