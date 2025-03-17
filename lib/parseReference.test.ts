import { assertEquals } from "@std/assert";
import { parseReference } from "./parseReference.ts";

Deno.test("Is fine without an end", () => {
  const ref = parseReference("1 Nephi 3:7");

  assertEquals(ref, {
    book: {
      "name": "1 Nephi",
      "path": "/study/scriptures/bofm/1-ne",
      "abbr": "1 Ne.",
    },
    chapter: 3,
    start: 7,
    end: undefined,
  });
});

Deno.test("Finds the end", () => {
  const ref = parseReference("1 Corinthians 15:40-46");

  assertEquals(ref, {
    book: {
      name: "1 Corinthians",
      path: "/study/scriptures/nt/1-cor",
      abbr: "1 Cor.",
    },
    chapter: 15,
    start: 40,
    end: 46,
  });
});

Deno.test("Finds without verses", () => {
  const ref = parseReference("Jacob 5");

  assertEquals(ref, {
    book: {
      name: "Jacob",
      path: "/study/scriptures/bofm/jacob",
      abbr: "Jacob",
    },
    chapter: 5,
    start: undefined,
    end: undefined,
  });
});

Deno.test("Finds book", () => {
  const ref = parseReference("Omni");

  assertEquals(ref, {
    book: {
      "name": "Omni",
      "path": "/study/scriptures/bofm/omni",
      "abbr": "Omni",
      chapters: 1
    },
    chapter: 1,
    start: undefined,
    end: undefined,
  });
});

Deno.test("Finds D&C", () => {
  const ref = parseReference("D&C 20:1");

  assertEquals(ref, {
    book: {
      "name": "Doctrine and Covenants",
      "path": "/study/scriptures/dc-testament/dc",
      "abbr": "D&C",
    },
    chapter: 20,
    start: 1,
    end: undefined,
  });
});

Deno.test("Finds ranges", () => {
  const ref = parseReference("Exodus 20:13");

  assertEquals(ref, {
    book: {
      "name": "Exodus",
      "path": "/study/scriptures/ot/ex",
      "abbr": "Ex.",
    },
    chapter: 20,
    start: 13,
    end: undefined,
  });
});
