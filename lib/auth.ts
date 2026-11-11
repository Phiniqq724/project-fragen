import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { localizedRedirectPath } from "./i18n/server";

export type Teacher = { id: string; email: string };

/**
 * The real authorization check. Call it at the top of every admin page,
 * Server Action and Route Handler. proxy.ts only does an optimistic redirect.
 * Reads cookies, so callers must sit behind <Suspense>.
 */
export async function requireTeacher(): Promise<{ teacher: Teacher; supabase: Awaited<ReturnType<typeof createServerSupabase>> }> {
  await cookies();
  if (!isSupabaseConfigured()) redirect(await localizedRedirectPath("/login"));
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect(await localizedRedirectPath("/login"));
  return { teacher: { id: data.user.id, email: data.user.email ?? "" }, supabase };
}
