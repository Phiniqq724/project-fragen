import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./env";

/**
 * Cookie-less client with the anon key. Safe to call inside `use cache`
 * scopes because it never reads the request. RLS limits it to published lessons.
 */
export function createPublicClient() {
  const { url, key } = requireSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
