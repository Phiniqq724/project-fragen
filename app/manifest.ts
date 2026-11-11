import type { MetadataRoute } from "next";

/** Lets students add Fragen to their phone home screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fragen",
    short_name: "Fragen",
    description: "Lessons for our Deutsch class. Open any lesson on your phone or laptop.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffe066",
    theme_color: "#ffe066",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
