import { assertEquals } from "@std/assert";
import { linkClip } from "./clipboard.ts";

const url = "https://example.org/john/3?id=p16&lang=eng#p16";

Deno.test("linkClip: link alone pastes the URL as plain text", () => {
  assertEquals(linkClip("John 3:16", url), {
    plain: url,
    html:
      `<a href="https://example.org/john/3?id=p16&amp;lang=eng#p16">John 3:16</a>`,
  });
});

Deno.test("linkClip: verse plus link, HTML escaped", () => {
  const clip = linkClip("Jn 3:16", url, `For God <so> loved`);
  assertEquals(clip.plain, `For God <so> loved Jn 3:16 ${url}`);
  assertEquals(
    clip.html?.startsWith("For God &lt;so&gt; loved <a href="),
    true,
  );
});
