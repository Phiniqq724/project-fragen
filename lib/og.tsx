import "server-only";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#201a0f";
const SUN = "#ffe066";
const TOMATO = "#c93a22";
const SURFACE = "#fffdf5";

/** Fetch a Fontshare face as TTF for ImageResponse (woff2 is not supported there). */
async function fontshareTtf(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://api.fontshare.com/v2/css?f[]=${family}@${weight}`).then((r) => r.text());
    const url = css.match(/url\('([^']+\.ttf)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url.startsWith("//") ? `https:${url}` : url).then((r) => r.arrayBuffer());
  } catch {
    return null; // Offline build: ImageResponse falls back to its default font.
  }
}

/**
 * Share card in the Pop Quiz style: sun yellow, faint grid, the "Fragen ?" mark,
 * and a big headline sticker. Used for the site card and each lesson's card.
 */
export async function renderShareCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const [display, body] = await Promise.all([fontshareTtf("cabinet-grotesk", 800), fontshareTtf("switzer", 600)]);
  const fonts = [
    ...(display ? [{ name: "Cabinet Grotesk", data: display, weight: 800 as const, style: "normal" as const }] : []),
    ...(body ? [{ name: "Switzer", data: body, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const titleSize = title.length > 60 ? 58 : title.length > 34 ? 70 : 86;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: SUN,
          backgroundImage:
            "linear-gradient(rgba(32,26,15,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(32,26,15,0.08) 2px, transparent 2px)",
          backgroundSize: "60px 60px",
          fontFamily: "Switzer",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: "Cabinet Grotesk", fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>Fragen</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 56,
              background: TOMATO,
              color: SURFACE,
              border: `4px solid ${INK}`,
              borderRadius: 14,
              boxShadow: `5px 5px 0 ${INK}`,
              transform: "rotate(8deg)",
              fontFamily: "Cabinet Grotesk",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            ?
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            background: SURFACE,
            border: `5px solid ${INK}`,
            borderRadius: 28,
            boxShadow: `12px 12px 0 ${INK}`,
            padding: "36px 44px",
            transform: "rotate(-1deg)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: TOMATO,
              color: SURFACE,
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontFamily: "Cabinet Grotesk",
              fontWeight: 800,
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </span>
        </div>

        <span style={{ fontSize: 28, fontWeight: 600 }}>{footer}</span>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
