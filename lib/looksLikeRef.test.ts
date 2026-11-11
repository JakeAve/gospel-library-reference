import { assertEquals } from "@std/assert";
import { parseRef } from "@jakeave/scripture-ref/client";
import { looksLikeRef } from "./looksLikeRef.ts";

const check = (input: string) => looksLikeRef(input, parseRef(input));

Deno.test("references and partial book names", () => {
  for (
    const s of [
      "2 nephi",
      "2 n 3",
      "ps 23",
      "gen",
      "2 ne 3:4",
      "alm",
      "Alma 32:21",
      "d&c 20:1-4",
      "1 john",
      "moro 10:4-5",
      "1 nefi 3:7",
      "articles of faith",
      "js-h 1:17",
    ]
  ) assertEquals(check(s), true, s);
});

Deno.test("quotes and words that aren't books", () => {
  for (
    const s of [
      "faith hope",
      "I am",
      "small and simple things",
      "if any man will do his will",
      "charity",
      "a",
      "je",
      "jesu",
      "beho",
      "be sti",
      "men a",
      "1 nefi",
      "3",
      "",
    ]
  ) assertEquals(check(s), false, s);
});
