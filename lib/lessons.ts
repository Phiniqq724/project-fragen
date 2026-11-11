import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { LESSON_BUCKET } from "./supabase/env";

export const LESSONS_TAG = "lessons";

export type Lesson = {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string | null;
  topic: string | null;
  storage_path: string;
  file_name: string;
  file_size: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const LESSON_COLUMNS =
  "id, slug, code, title, description, topic, storage_path, file_name, file_size, published, created_at, updated_at";

/** Published lessons, newest first. Cached; admin mutations call updateTag(LESSONS_TAG). */
export async function getPublishedLessons(): Promise<Lesson[]> {
  "use cache";
  cacheTag(LESSONS_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("lessons")
    .select(LESSON_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load lessons: ${error.message}`);
  return data ?? [];
}

export async function getPublishedLessonBySlug(slug: string): Promise<Lesson | null> {
  "use cache";
  cacheTag(LESSONS_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("lessons")
    .select(LESSON_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(`Could not load lesson: ${error.message}`);
  return data;
}

/** Raw HTML of a published lesson, or null if it does not exist / is unpublished. */
export async function getPublishedLessonHtml(slug: string): Promise<string | null> {
  "use cache";
  cacheTag(LESSONS_TAG);
  cacheLife("hours");

  const lesson = await getPublishedLessonBySlug(slug);
  if (!lesson) return null;
  const { data, error } = await createPublicClient()
    .storage.from(LESSON_BUCKET)
    .download(lesson.storage_path);
  if (error || !data) throw new Error(`Could not load lesson file: ${error?.message ?? "missing"}`);
  return await data.text();
}

/** Slug of the published lesson with this short code, or null. */
export async function getPublishedSlugByCode(code: string): Promise<string | null> {
  "use cache";
  cacheTag(LESSONS_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("lessons")
    .select("slug")
    .eq("code", code)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(`Could not resolve short link: ${error.message}`);
  return data?.slug ?? null;
}
