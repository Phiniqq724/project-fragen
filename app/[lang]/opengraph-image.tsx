import { defaultLocale, hasLocale } from "@/lib/i18n/config";
import { dictionaryFor } from "@/lib/i18n/dictionary";
import { OG_SIZE, renderShareCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Fragen";

/** Share card for the lesson list (and any page without its own card), per language. */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { common, public: t } = dictionaryFor(hasLocale(lang) ? lang : defaultLocale);
  return renderShareCard({ eyebrow: common.allLessons, title: t.seo.siteCardTitle, footer: t.seo.cardFooter });
}
