import type { Metadata } from "next";
import { ButtonLink, PageHeading, SiteShell, StickerTitle, IconList } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/dictionary";

export const metadata: Metadata = { robots: { index: false } };

export default async function NotFound() {
  const { common } = await getDictionary();
  return (
    <SiteShell>
      <PageHeading title={<StickerTitle heading={common.notFound.heading} />} lead={common.notFound.lead} />
      <ButtonLink href="/" icon={<IconList />}>
        {common.seeAllLessons}
      </ButtonLink>
    </SiteShell>
  );
}
