import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Work Adda - Find Local Workers in Sircilla",
    short_name: "Work Adda",
    description:
      "Find trusted electricians, plumbers, painters, carpenters, and local workers in Sircilla. Call or WhatsApp directly with zero commission.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F7",
    theme_color: "#FF385C",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
