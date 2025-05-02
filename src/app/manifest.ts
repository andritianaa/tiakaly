import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tiakaly",
    short_name: "Tiakaly",
    description: "Une histoire sans faim",
    start_url: "/",
    display: "standalone",
    background_color: "transparent",
    theme_color: "#fad02c",
    icons: [
      {
        src: "/logo-round.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-round.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
