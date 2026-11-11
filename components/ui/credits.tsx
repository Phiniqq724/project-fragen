import sndyy from "@/public/brand/sndyy.png";

/** Copyright year, stamped at build time (next.config.ts), so it updates with every deploy. */
const YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR;

// Both credits behave the same: lift, tilt and turn tomato on hover or keyboard focus.
// (The logo is a mask, not a blended image, so tilting no longer shows a box behind it.)
const link =
  "inline-flex min-h-11 items-center px-1 text-ink transition-[color,transform] duration-200 ease-(--ease-out) " +
  "hover:-translate-y-0.5 hover:-rotate-6 hover:text-accent " +
  "focus-visible:-translate-y-0.5 focus-visible:-rotate-6 focus-visible:text-accent";

/** Footer credit on every page: © year SNDYY × Hazz, each linking to its portfolio. */
export function Credits() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm font-semibold text-ink">
      <span>© {YEAR}</span>
      <a href="https://sndyy.id" target="_blank" rel="noopener" aria-label="SNDYY" className={link}>
        {/* The SNDYY wordmark (transparent PNG) used as a mask, so it is painted in the link's text colour. */}
        <span
          aria-hidden
          className="block h-3.5 bg-current"
          style={{
            aspectRatio: `${sndyy.width} / ${sndyy.height}`,
            maskImage: `url(${sndyy.src})`,
            WebkitMaskImage: `url(${sndyy.src})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </a>
      <span aria-hidden className="text-ink-muted">
        ×
      </span>
      <a
        href="https://hazanasrullah.framer.ai/"
        target="_blank"
        rel="noopener"
        className={`${link} font-display text-base font-extrabold tracking-tight`}
      >
        Hazz
      </a>
    </p>
  );
}
