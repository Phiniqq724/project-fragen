import type { ReactNode } from "react";
import { ButtonLink } from "./button";
import { IconBack } from "./icons";
import { cn } from "./cn";
import { Credits } from "./credits";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { TeacherShortcut } from "./teacher-shortcut";
import { Wordmark } from "./wordmark";

/** One container for every page so headers and content always line up. */
export const CONTAINER = "mx-auto w-full max-w-4xl px-4 sm:px-6";

/**
 * Page frame shared by every route: the same header row (logo left, actions right)
 * and the same content width. The grid background comes from the root layout.
 * Without `actions`, the header shows the teacher shortcut for signed-in teachers.
 */
export function SiteShell({
  home = "/",
  suffix,
  actions,
  children,
}: {
  home?: string;
  suffix?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip">
      <header className={cn(CONTAINER, "flex min-h-20 flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4 sm:pt-6")}>
        <Wordmark href={home} suffix={suffix} />
        {/* Student pages get the teacher shortcut (renders nothing unless a teacher is signed in). */}
        <div className="flex flex-wrap items-center gap-2.5">
          {actions ?? <TeacherShortcut />}
          <LanguageSwitcher />
        </div>
      </header>
      <main className={cn(CONTAINER, "flex-1 pt-6 pb-16 sm:pt-10")}>{children}</main>
      <footer className={cn(CONTAINER, "pb-6")}>
        <Credits />
      </footer>
    </div>
  );
}

/** Back button: same look and position on every page that has one (top left, above the heading). */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <ButtonLink href={href} variant="secondary" size="sm" className="mb-6 pl-2.5" icon={<IconBack />}>
      {children}
    </ButtonLink>
  );
}

/**
 * Page heading used everywhere. Put ONE word of the title in <span className="sticker-word">.
 * `actions` sit on the right on desktop and wrap under the title on phones.
 */
export function PageHeading({
  title,
  lead,
  back,
  actions,
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      {back ? <BackLink href={back.href}>{back.label}</BackLink> : null}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
        <div className="min-w-0 flex-1 basis-80">
          <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight [overflow-wrap:anywhere] sm:text-5xl">
            {title}
          </h1>
          {lead ? <div className="mt-4 max-w-prose text-base text-ink-muted">{lead}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

/** Renders a translated StickerHeading: `${before} <sticker>${word}</sticker>${after}`. */
export function StickerTitle({ heading }: { heading: { before: string; word: string; after: string } }) {
  return (
    <>
      {heading.before ? `${heading.before} ` : null}
      <span className="sticker-word">{heading.word}</span>
      {heading.after}
    </>
  );
}
