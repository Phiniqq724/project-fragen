import type { Metadata, Viewport } from "next";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { I18nProvider } from "@/components/i18n/provider";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import "../globals.css";

// Fonts come from Fontshare only (owner decision): Cabinet Grotesk for display, Switzer for text.
const FONTSHARE_CSS =
  "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=switzer@400,500,600,700&display=swap";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { common } = await getDictionary();
  return {
    title: { default: "Fragen", template: "%s · Fragen" },
    description: common.tagline,
  };
}

export const viewport: Viewport = {
  themeColor: "#ffe066",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, ...dict } = await getDictionary();
  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTSHARE_CSS} />
      </head>
      <body className="min-h-full flex flex-col">
        <GridBackdrop />
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
