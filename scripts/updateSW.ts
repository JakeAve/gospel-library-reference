type Snapshot = {
  build_id: string;
  files: {
    [key: string]: string[];
  };
};

import { green } from "$std/fmt/colors.ts";
import _snapshot from "../_fresh/snapshot.json" with { type: "json" };

const snapshot = _snapshot as Snapshot;

const SW_PATH = "./static/sw.js";
// const ROUTES_PATH = "./routes";

async function updateSW() {
  const swContents = await Deno.readTextFile(SW_PATH);
  let updatedContent = swContents;
  const updatedLine = `const PRE_CACHE = "pre-cache-${snapshot.build_id}";\n`;

  updatedContent = updatedContent.replace(/.*\n/m, updatedLine);

  const preCache = new Set([
    "/styles.css",
    "/register.js",
    "/favicon.ico",
    "/",
  ]);

  for (const file in snapshot.files) {
    preCache.add(`/_frsh/js/${snapshot.build_id}/${file}`);
    snapshot.files[file].forEach((chunk) => {
      preCache.add(`/_frsh/js/${snapshot.build_id}/${chunk}`);
    });
  }

  const updatedPreCache = `const PRE_CACHE_URLS = ${
    JSON.stringify(Array.from(preCache), null, 2)
  };`;

  updatedContent = updatedContent.replace(
    /const PRE_CACHE_URLS[\s\S]*?\];/m,
    updatedPreCache,
  );

  await Deno.writeTextFile(SW_PATH, updatedContent);
}

updateSW();
console.log(`Updated: ${green(SW_PATH)}`);
