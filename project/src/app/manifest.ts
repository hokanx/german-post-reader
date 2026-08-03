import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "German Post Letter Reader",
    short_name: "German Post",
    description:
      "Translate and understand your German post — plain-language summaries, deadlines, and ready-to-send replies.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#7c3aed",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
