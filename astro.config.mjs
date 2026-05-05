import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { agenticEdit } from "@agentic-cms/edit-runtime/astro";

export default defineConfig({
  output: "static",
  integrations: [react(), agenticEdit()],
  vite: {
    plugins: [tailwindcss()],
  },
});
