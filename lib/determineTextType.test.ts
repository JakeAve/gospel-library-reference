import { determineTextType } from "./determineTextType.ts";
import { assertEquals } from "$std/assert/mod.ts";

Deno.test("1 nephi 3:7", () => {
  const input = "1 nephi 3:7";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("1 John", () => {
  const input = "1 John";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("d&c 20:1-4", () => {
  const input = "d&c 20:1-4";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("can take ref matches", () => {
  const input = "if any man will do his will";

  const result = determineTextType(input);

  assertEquals(result, "query");
});

Deno.test("small and simple things", () => {
  const input = "small and simple things";

  const result = determineTextType(input);

  assertEquals(result, "query");
});

// too small
Deno.test("I am", () => {
  const input = "I am";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("articles of faith 13", () => {
  const input = "articles of faith";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("official declaration", () => {
  const input = "official declaration";

  const result = determineTextType(input);

  assertEquals(result, "reference");
});

Deno.test("else why then are they baptized for the dead", () => {
  const input = "else why then are they baptized for the dead";

  const result = determineTextType(input);

  assertEquals(result, "query");
});
