"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useI18n } from "@/components/i18n/provider";
import { ButtonLink } from "./button";
import { IconPanel } from "./icons";

/**
 * Shows "Teacher panel" on student pages, only to a signed-in teacher.
 * Checks the local session in the browser so student pages stay static and cached.
 * UI convenience only: /admin is still protected on the server.
 */
export function TeacherShortcut() {
  const { dict } = useI18n();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      createBrowserSupabase()
        .auth.getSession()
        .then(({ data }) => {
          if (!cancelled) setSignedIn(Boolean(data.session));
        });
    } catch {
      // Supabase not configured: nothing to show.
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!signedIn) return null;
  return (
    <ButtonLink href="/admin" variant="secondary" size="sm" icon={<IconPanel />}>
      {dict.common.teacherPanel}
    </ButtonLink>
  );
}
