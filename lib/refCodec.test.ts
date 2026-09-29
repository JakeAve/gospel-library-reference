import { parseRef } from "@jakeave/scripture-ref/client";
import type { Reference } from "@jakeave/scripture-ref/types";
import { assertEquals, assertMatch, assertThrows } from "@std/assert";
import { CANON } from "./canon.ts";
import { decode, encode } from "./refCodec.ts";

Deno.test("canon totals 43,610 units", () => {
  const units = CANON.reduce(
    (sum, { chapters }) =>
      sum + (chapters ? chapters.reduce((s, n) => s + n + 1, 0) : 1),
    0,
  );

  assertEquals(units, 43610);
});

Deno.test("round-trips a mixed list", () => {
  const input = [
    "Moroni 10:4-5",
    "Articles of Faith 1:13", // last unit
    "Alma 32:21-23, 25",
    "John 3:16",
    "Old Testament Title Page", // first unit
    "BoM Intro.",
    "Genesis 1:1",
    "Alma 32",
    "Joseph Smith—History 1:15-17",
    "D&C 121:41-46",
    "Official Declaration 2",
    "Alma 32:21",
  ].map(parseRef);

  const digits = encode(input);
  const result = decode(digits);

  assertMatch(digits, /^[0-9]+$/);
  assertEquals(result.map((r) => r.reference), input.map((r) => r.reference));
  assertEquals(result.map((r) => r.link), input.map((r) => r.link));
});

Deno.test("encode normalizes unsorted, overlapping spans", () => {
  const ref: Reference = {
    ...parseRef("Alma 32:21"),
    verses: [25, [22, 23], 21, 24],
  };

  const result = decode(encode([ref]));

  assertEquals(result[0].reference, "Alma 32:21-25");
});

Deno.test('encode([]) is ""', () => {
  assertEquals(encode([]), "");
  assertEquals(decode(""), []);
});

Deno.test("decode rejects out-of-range input", () => {
  assertThrows(() => decode("12a"), RangeError);
  assertThrows(() => decode("43611"), RangeError); // unit 0 with data left
  const alma = parseRef("Alma 63:17");
  assertThrows(() => encode([{ ...alma, verses: [18] }]), RangeError);
  assertThrows(() => encode([{ ...alma, chapter: 64 }]), RangeError);
  assertThrows(() => encode([parseRef("Alma")]), RangeError);
});
