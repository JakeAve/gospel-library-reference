import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [deno()],
  publicDir: "static",
  envPrefix: "API_",
  esbuild: { jsx: "automatic", jsxImportSource: "preact" },
});
