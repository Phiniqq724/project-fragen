"use client";

import { useState } from "react";
import { Button, IconCheck, IconCopy } from "@/components/ui";
import { useI18n } from "@/components/i18n/provider";

/**
 * Copies a lesson's short student link (fragen.sndyy.id/<code>). No language prefix on
 * purpose: each student opens it in their own language. `iconOnly` renders a square
 * sticker button for the lesson list; the label then lives in aria-label / tooltip.
 */
export function CopyLinkButton({ code, lessonTitle, iconOnly = false }: { code: string; lessonTitle: string; iconOnly?: boolean }) {
  const { dict } = useI18n();
  const t = dict.admin.edit.saved;
  const [copied, setCopied] = useState(false);
  const label = copied ? t.linkCopied : t.copyLink;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={copy}
      icon={copied ? <IconCheck /> : <IconCopy />}
      aria-label={iconOnly ? `${label}: ${lessonTitle}` : undefined}
      title={iconOnly ? label : undefined}
      className={iconOnly ? "w-11 px-0 sm:w-10" : undefined}
    >
      {iconOnly ? null : label}
      {/* Announces "Link copied" to screen readers without moving focus. */}
      <span className="sr-only" aria-live="polite">
        {copied ? t.linkCopied : ""}
      </span>
    </Button>
  );
}
