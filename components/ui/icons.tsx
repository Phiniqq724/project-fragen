import type { SVGProps } from "react";

/**
 * Small hand-drawn icon set for buttons. Thick rounded strokes (2.25) so they match
 * the 2px sticker outlines; all draw in currentColor on a 20px grid.
 */
function Svg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className="shrink-0"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Arrow rising out of a tray. */
export const IconUpload = () => (
  <Svg>
    <path d="M10 13V3.5M6 7.2 10 3.3l4 3.9" />
    <path d="M3.5 12.5v2.2c0 1 .8 1.8 1.8 1.8h9.4c1 0 1.8-.8 1.8-1.8v-2.2" />
  </Svg>
);

/** Pencil. */
export const IconEdit = () => (
  <Svg>
    <path d="M12.6 4.1 15.9 7.4 7.3 16H4v-3.3z" />
    <path d="m10.8 5.9 3.3 3.3" />
  </Svg>
);

/** Eye. */
export const IconView = () => (
  <Svg>
    <path d="M1.8 10S4.8 4.5 10 4.5 18.2 10 18.2 10 15.2 15.5 10 15.5 1.8 10 1.8 10Z" />
    <circle cx="10" cy="10" r="2.4" />
  </Svg>
);

/** Door with an arrow leaving. */
export const IconSignOut = () => (
  <Svg>
    <path d="M8 3.5H5.3c-1 0-1.8.8-1.8 1.8v9.4c0 1 .8 1.8 1.8 1.8H8" />
    <path d="M12.5 6.5 16 10l-3.5 3.5M16 10H7.5" />
  </Svg>
);

/** Door with an arrow entering. */
export const IconSignIn = () => (
  <Svg>
    <path d="M12 3.5h2.7c1 0 1.8.8 1.8 1.8v9.4c0 1-.8 1.8-1.8 1.8H12" />
    <path d="M8 6.5 11.5 10 8 13.5M11.5 10H3" />
  </Svg>
);

/** Tick. */
export const IconCheck = () => (
  <Svg>
    <path d="m4 10.5 4 4 8-9" />
  </Svg>
);

/** Cross. */
export const IconClose = () => (
  <Svg>
    <path d="M5 5l10 10M15 5 5 15" />
  </Svg>
);

/** Bin. */
export const IconTrash = () => (
  <Svg>
    <path d="M3.5 5.5h13M8 5.5V4c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1.5" />
    <path d="M5.2 5.5 6 15.6c.1.8.7 1.4 1.5 1.4h5c.8 0 1.4-.6 1.5-1.4l.8-10.1" />
  </Svg>
);

/** Two arrows swapping places. */
export const IconReplace = () => (
  <Svg>
    <path d="M4 7.5h11l-3-3M16 12.5H5l3 3" />
  </Svg>
);

/** Two stacked sheets. */
export const IconCopy = () => (
  <Svg>
    <rect x="7" y="7" width="9.5" height="9.5" rx="2" />
    <path d="M13 4.5v-.2c0-.9-.7-1.6-1.6-1.6H4.6c-.9 0-1.6.7-1.6 1.6v6.8c0 .9.7 1.6 1.6 1.6h.2" />
  </Svg>
);

/** Arrow pointing back. */
export const IconBack = () => (
  <Svg>
    <path d="M16 10H4.5M9 5.5 4.5 10 9 14.5" />
  </Svg>
);

/** Corners pushing outward. */
export const IconExpand = () => (
  <Svg>
    <path d="M12 3.5h4.5V8M8 16.5H3.5V12M16.5 3.5l-5 5M3.5 16.5l5-5" />
  </Svg>
);

/** Stack of lesson rows. */
export const IconList = () => (
  <Svg>
    <rect x="3" y="3.5" width="14" height="5" rx="1.6" />
    <rect x="3" y="11.5" width="14" height="5" rx="1.6" />
  </Svg>
);

/** Circular arrow. */
export const IconRetry = () => (
  <Svg>
    <path d="M16 10a6 6 0 1 1-1.8-4.3" />
    <path d="M16.2 3.5v3.4h-3.4" />
  </Svg>
);

/** Page with a folded corner. */
export const IconFile = () => (
  <Svg>
    <path d="M11.5 2.8H6c-1 0-1.8.8-1.8 1.8v10.8c0 1 .8 1.8 1.8 1.8h8c1 0 1.8-.8 1.8-1.8V7.1z" />
    <path d="M11.5 2.8v4.3h4.3" />
  </Svg>
);

/** Teacher panel: sticker board with a corner tab. */
export const IconPanel = () => (
  <Svg>
    <rect x="3" y="3" width="14" height="14" rx="2.5" />
    <path d="M3 8h14M8 8v9" />
  </Svg>
);
