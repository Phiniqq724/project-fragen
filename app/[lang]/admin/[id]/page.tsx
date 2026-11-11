import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { prepareLessonHtml } from "@/lib/lesson-html";
import { LESSON_BUCKET } from "@/lib/supabase/env";
import type { Lesson } from "@/lib/lessons";
import { Notice, Loader } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/dictionary";
import { EditLesson } from "./edit-lesson";

export async function generateMetadata(): Promise<Metadata> {
  const { admin } = await getDictionary();
  return { title: admin.edit.title, robots: { index: false } };
}

export default async function EditPage({ params, searchParams }: PageProps<"/[lang]/admin/[id]">) {
  const { admin } = await getDictionary();
  return (
    <Suspense fallback={<Loader label={admin.loadingLesson} />}>
      <LessonLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function LessonLoader({
  params,
  searchParams,
}: {
  params: PageProps<"/[lang]/admin/[id]">["params"];
  searchParams: PageProps<"/[lang]/admin/[id]">["searchParams"];
}) {
  const { supabase } = await requireTeacher();
  const { admin } = await getDictionary();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data, error } = await supabase.from("lessons").select("*").eq("id", id).maybeSingle();
  if (error) {
    return (
      <Notice tone="danger" title={admin.edit.loadError.title}>
        {admin.edit.loadError.body}
      </Notice>
    );
  }
  if (!data) notFound();
  const lesson = data as Lesson;

  const file = await supabase.storage.from(LESSON_BUCKET).download(lesson.storage_path);
  const srcDoc = file.data ? prepareLessonHtml(await file.data.text()) : null;
  const saved = query.saved === "1";

  return <EditLesson lesson={lesson} srcDoc={srcDoc} saved={saved} />;
}
