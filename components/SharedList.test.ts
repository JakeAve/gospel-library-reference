import { assertEquals } from "@std/assert";
import { parseRef } from "@jakeave/scripture-ref/client";
import { encode } from "../lib/refCodec.ts";
import { decodeShared } from "./SharedList.tsx";

Deno.test("decodeShared: bad digits give an empty list", () => {
  assertEquals(decodeShared("abc"), []);
});

Deno.test("decodeShared: digits over the length cap give an empty list", () => {
  assertEquals(decodeShared("1".repeat(2001)), []);
});

Deno.test("decodeShared: round-trips a shared list", () => {
  const refs = decodeShared(encode([parseRef("Alma 32:21")]));
  assertEquals(refs.map((r) => r.reference), ["Alma 32:21"]);
});
