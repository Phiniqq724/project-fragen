"use client";

import { useI18n } from "@/components/i18n/provider";
import { Button, ButtonLink, PageHeading, SiteShell, StickerTitle } from "@/components/ui";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { common } = useI18n().dict;
  return (
    <SiteShell>
      <PageHeading title={<StickerTitle heading={common.error.heading} />} lead={common.error.lead} />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => retry()}>{common.error.retry}</Button>
        <ButtonLink href="/" variant="secondary">
          {common.seeAllLessons}
        </ButtonLink>
      </div>
    </SiteShell>
  );
}
