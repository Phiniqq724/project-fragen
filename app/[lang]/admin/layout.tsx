import { Suspense } from "react";
import { ButtonLink, SiteShell, buttonClass } from "@/components/ui";
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
  const { teacher } = await requireTeacher();
  const { admin } = await getDictionary();
  return (
    <>
      <p className="hidden max-w-56 truncate text-sm font-semibold text-ink-muted md:block" title={teacher.email}>
        {teacher.email}
      </p>
      <ButtonLink href="/" variant="secondary" size="sm">
        {admin.viewSite}
      </ButtonLink>
      <form action={signOut}>
        <button type="submit" className={buttonClass("secondary", "sm")}>
          {admin.signOut}
        </button>
      </form>
    </>
  );
}
