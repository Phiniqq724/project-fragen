"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { actionDictionary, localizedRedirectPath } from "@/lib/i18n/server";

export type SignInState = { error: string | null; email: string };

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const { admin } = await actionDictionary();
  const t = admin.login;

  if (!isSupabaseConfigured()) {
    return { error: t.notSetUp, email };
  }
  if (!email || !password) {
    return { error: t.needBoth, email };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const wrongCredentials = error.code === "invalid_credentials" || error.status === 400;
    return {
      error: wrongCredentials
        ? t.wrong
        : t.unavailable,
      email,
    };
  }

  redirect(await localizedRedirectPath("/admin"));
}
