"use client";

import { useI18n } from "@/components/i18n/provider";
import { Button, ButtonLink, PageHeading, SiteShell, StickerTitle, IconList, IconRetry } from "@/components/ui";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { common } = useI18n().dict;
  return (
    <SiteShell>
      <PageHeading title={<StickerTitle heading={common.error.heading} />} lead={common.error.lead} />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => retry()} icon={<IconRetry />}>
          {common.error.retry}
        </Button>
        <ButtonLink href="/" variant="secondary" icon={<IconList />}>
          {common.seeAllLessons}
        </ButtonLink>
      </div>
    </SiteShell>
  );
}
