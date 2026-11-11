import { ButtonLink, PageHeading, SiteShell, StickerTitle } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function NotFound() {
  const { common } = await getDictionary();
  return (
    <SiteShell>
      <PageHeading title={<StickerTitle heading={common.notFound.heading} />} lead={common.notFound.lead} />
      <ButtonLink href="/">{common.seeAllLessons}</ButtonLink>
    </SiteShell>
  );
}
