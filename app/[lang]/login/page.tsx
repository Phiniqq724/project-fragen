import type { Metadata } from "next";
import { Notice, PageHeading, SiteShell } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const { admin } = await getDictionary();
  return { title: admin.login.title, robots: { index: false } };
}

export default async function LoginPage() {
  const { admin, common } = await getDictionary();
  const t = admin.login;
  const configured = isSupabaseConfigured();

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-md">
        <PageHeading
          back={{ href: "/", label: common.allLessons }}
          title={
            <>
              {t.heading.before}
              <span className="sticker-word">{t.heading.word}</span>
              {t.heading.after}
            </>
          }
          lead={t.lead}
        />
        {configured ? (
          <div className="sticker p-5 sm:p-6">
            <LoginForm />
          </div>
        ) : (
          <Notice title={t.notConnected}>
            <p>
              {t.setupBefore} <code className="font-mono text-sm text-ink">.env.example</code> {t.setupTo}{" "}
              <code className="font-mono text-sm text-ink">.env.local</code>
              {t.setupFill} <code className="font-mono text-sm text-ink">supabase/migrations/0001_init.sql</code>{" "}
              {t.setupAfter}
            </p>
          </Notice>
        )}
        <p className="mt-6 text-sm text-ink-muted">
          {t.note}
        </p>
      </div>
    </SiteShell>
  );
}
