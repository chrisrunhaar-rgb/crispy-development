import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crispy Development",
    short_name: "Crispy",
    description: "Raising leaders who cross cultures.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F8F7F4",
    theme_color: "#1B3A6B",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
