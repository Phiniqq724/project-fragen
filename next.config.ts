import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets a verification build use its own folder (NEXT_DIST_DIR=.next-verify) so it
  // never shares caches with a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  // Footer copyright year, fixed per build so pages stay prerendered.
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()) },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
