import { Suspense } from "react";
import { ButtonLink, SiteShell, buttonClass, IconView, IconSignOut } from "@/components/ui";
import { requireTeacher } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { signOut } from "./actions";

export default async function AdminLayout({ children }: LayoutProps<"/[lang]/admin">) {
  const { admin } = await getDictionary();
  return (
    <SiteShell
      home="/admin"
      suffix={admin.teacherSuffix}
      actions={
        <Suspense fallback={<div className="min-h-11" aria-hidden />}>
          <Account />
        </Suspense>
      }
    >
      <Suspense fallback={<p className="text-ink-muted">{admin.loading}</p>}>{children}</Suspense>
    </SiteShell>
  );
}

/** Reads the session cookie, so it streams in behind Suspense. */
async function Account() {
  // Still checks the session; the email itself is no longer shown.
  await requireTeacher();
  const { admin } = await getDictionary();
  return (
    <>
      <ButtonLink href="/" variant="secondary" size="sm" icon={<IconView />}>
        {admin.viewSite}
      </ButtonLink>
      <form action={signOut}>
        <button type="submit" className={buttonClass("primary", "sm")}>
          <IconSignOut />
          {admin.signOut}
        </button>
      </form>
    </>
  );
}
