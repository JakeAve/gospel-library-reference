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
    ranges: [7],
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
    ranges: [[40, 46]],
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
    ranges: [],
  });
});

Deno.test("Finds book", () => {
  const ref = parseReference("Omni");

  assertEquals(ref, {
    book: {
      "name": "Omni",
      "path": "/study/scriptures/bofm/omni",
      "abbr": "Omni",
      chapters: 1,
    },
    chapter: 1,
    ranges: [],
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
    ranges: [1],
  });
});

Deno.test("Finds single verse", () => {
  const ref = parseReference("Exodus 20:13");

  assertEquals(ref, {
    book: {
      "name": "Exodus",
      "path": "/study/scriptures/ot/ex",
      "abbr": "Ex.",
    },
    chapter: 20,
    ranges: [13],
  });
});

Deno.test("Finds range of verses", () => {
  const ref = parseReference("Mosiah 4:15-19");

  assertEquals(ref, {
    book: {
      "name": "Mosiah",
      "path": "/study/scriptures/bofm/mosiah",
      "abbr": "Mosiah",
    },
    chapter: 4,
    ranges: [[15, 19]],
  });
});

Deno.test("Finds ranges of verses", () => {
  const ref = parseReference("Ether 12:4-27, 28-30, 31");

  assertEquals(ref, {
    book: {
      "name": "Ether",
      "path": "/study/scriptures/bofm/ether",
      "abbr": "Ether",
    },
    chapter: 12,
    ranges: [[4, 27], [28, 30], 31],
  });
});

Deno.test("Sorts verse ranges", () => {
  const ref = parseReference("John 17:9-10,6-1, ");

  assertEquals(ref, {
    book: {
      "name": "John",
      "path": "/study/scriptures/nt/john",
      "abbr": "John",
    },
    chapter: 17,
    ranges: [[1, 6], [9, 10]],
  });
});

Deno.test("Only book", () => {
  const ref = parseReference("Mormon");

  assertEquals(ref, {
    book: {
      "name": "Mormon",
      "path": "/study/scriptures/bofm/morm",
      "abbr": "Morm.",
    },
    chapter: undefined,
    ranges: [],
  });
});
