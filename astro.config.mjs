import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// `site` is the canonical production origin. It drives absolute canonical URLs,
// the generated sitemap, and Open Graph image URLs. Keep it in sync with
// src/data/site-meta.json `url`. If this launches on a different domain, update both.
export default defineConfig({
  site: "https://eaglepointwelding.com",
  output: "static",
  integrations: [
    react(),
    sitemap({
      // Keep internal/demo routes out of the index. /blog and /islands are
      // leftover starter demos; /styleguide is an internal design reference.
      filter: (page) =>
        !["/blog", "/islands", "/styleguide"].some((p) => page.includes(p)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
