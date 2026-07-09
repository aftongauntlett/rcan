// @ts-check
import { defineConfig } from "astro/config";
import process from "node:process";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL ?? "https://rcandc.org";

// https://astro.build/config
export default defineConfig({
  site,
  adapter: vercel(),
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
