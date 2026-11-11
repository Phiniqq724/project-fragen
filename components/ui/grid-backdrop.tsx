/**
 * Page background on every page: a faint grid on sun yellow. The grid stays sharp in the
 * middle and goes soft and blurred toward every edge, pulling the eye to the centre.
 * Fixed and static, so the blur is rasterised once (cheap on phones). Rendered once
 * in the root layout.
 */
const GRID =
  "linear-gradient(rgb(32 26 15 / 0.075) 1px, transparent 1px), linear-gradient(90deg, rgb(32 26 15 / 0.075) 1px, transparent 1px)";

export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-sun">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRID,
          backgroundSize: "44px 44px",
          backgroundPosition: "center",
          maskImage: "radial-gradient(ellipse 70% 72% at 50% 45%, #000 40%, transparent 85%)",
        }}
      />
      <div
        className="absolute -inset-4 blur-[3px]"
        style={{
          backgroundImage: GRID,
          backgroundSize: "44px 44px",
          backgroundPosition: "center",
          maskImage: "radial-gradient(ellipse 70% 72% at 50% 45%, transparent 40%, #000 85%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 85% at 50% 45%, transparent 55%, rgb(255 224 102 / 0.75) 100%)" }}
      />
    </div>
  );
}
