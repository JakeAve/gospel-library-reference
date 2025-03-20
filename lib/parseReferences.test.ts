import { assertEquals } from "@std/assert";
import { parseReferences } from "./parseReferences.ts";


Deno.test("Splits groups with semi colon", () => {
  const refs = parseReferences("1 Nephi 3:7; 1 Samuel 17:3");
  assertEquals(refs, ["1 Nephi 3:7", "1 Samuel 17:3"]);
});

Deno.test("Verse groups will be separate", () => {
  const refs = parseReferences("1 Nephi 3:7 17:3,50; 1 Samuel 17:3");
  assertEquals(refs, ["1 Nephi 3:7 17:3,50", "1 Samuel 17:3"]);
});
