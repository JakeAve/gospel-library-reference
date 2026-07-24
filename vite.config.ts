import { defineConfig, loadEnv } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, Deno.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    Deno.env.set(key, value);
  }

  return {
    plugins: [fresh(), tailwindcss()],
  };
});
