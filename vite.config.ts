import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "src/main.ts",
      },
      output: {
        dir: "dist",
        entryFileNames: "datetime-card.js",
        format: "iife",
        name: "DatetimeCard",
      },
    },
    sourcemap: true,
    target: "esnext",
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
});
