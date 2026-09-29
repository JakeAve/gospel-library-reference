import { assert, assertEquals } from "@std/assert";
import { parseRef } from "@jakeave/scripture-ref/client";
import { app } from "./main.ts";
import SharedList, { handler } from "./routes/s/[digits].tsx";
import { encode } from "./lib/refCodec.ts";

// fsRoutes() is empty without a Vite build, so register the route file by hand.
app.route("/s/:digits", { handler, component: SharedList as never });
const handle = app.handler();
const get = (path: string) => handle(new Request(`http://localhost${path}`));

Deno.test("/S/:digits redirects to /s/:digits", async () => {
  const res = await get("/S/123");
  assertEquals(res.status, 301);
  assert(res.headers.get("location")?.endsWith("/s/123"));
});

Deno.test("/s/ with bad digits is a 400 broken page", async () => {
  const res = await get("/s/abc");
  assertEquals(res.status, 400);
  assert((await res.text()).includes("looks broken"));
});

Deno.test("/s/ with digits over the length cap is a 400 broken page", async () => {
  const res = await get(`/s/${"1".repeat(2001)}`);
  assertEquals(res.status, 400);
});

Deno.test("/s/ renders the shared list", async () => {
  const res = await get(`/s/${encode([parseRef("Alma 32:21")])}`);
  assertEquals(res.status, 200);
  assert((await res.text()).includes("Alma 32:21"));
});
