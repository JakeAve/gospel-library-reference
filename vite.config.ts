import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [deno(), tailwindcss()],
  publicDir: "static",
  envPrefix: "API_",
  esbuild: { jsx: "automatic", jsxImportSource: "preact" },
});
