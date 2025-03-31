import { assertEquals } from "@std/assert";
import { parseReference } from "./parseReference.ts";

Deno.test("Is fine without an end", () => {
  const ref = parseReference("1 Nephi 3:7");

  assertEquals(ref, {
    book: {
      "name": "1 Nephi",
      "path": "/study/scriptures/bofm/1-ne",
      "abbr": "1 Ne.",
      "chapters": [
        20,
        24,
        31,
        38,
        22,
        18,
        27,
        36,
        38,
        22,
        36,
        23,
        42,
        30,
        36,
        39,
        55,
        25,
        24,
        34,
        22,
        31,
      ],
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
      "chapters": [
        31,
        16,
        23,
        21,
        13,
        20,
        40,
        13,
        27,
        33,
        34,
        31,
        13,
        40,
        58,
        24,
      ],
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
      "chapters": [19, 35, 13, 18, 21, 25, 27],
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
      chapters: [30],
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
      "chapters": [
        39,
        3,
        20,
        7,
        35,
        37,
        8,
        12,
        14,
        70,
        30,
        9,
        1,
        11,
        6,
        6,
        9,
        47,
        41,
        84,
        12,
        4,
        7,
        19,
        16,
        2,
        18,
        16,
        50,
        11,
        13,
        5,
        18,
        12,
        27,
        8,
        4,
        42,
        24,
        3,
        12,
        93,
        35,
        6,
        75,
        33,
        4,
        6,
        28,
        46,
        20,
        42,
        7,
        10,
        6,
        20,
        16,
        65,
        24,
        17,
        39,
        9,
        66,
        43,
        6,
        13,
        14,
        35,
        8,
        14,
        9,
        26,
        6,
        7,
        36,
        119,
        15,
        22,
        4,
        5,
        7,
        24,
        6,
        120,
        12,
        11,
        8,
        48,
        6,
        7,
        8,
        141,
        21,
        37,
        6,
        2,
        53,
        17,
        17,
        8,
        28,
        48,
        8,
        17,
        101,
        34,
        40,
        86,
        41,
        8,
        100,
        8,
        80,
        16,
        11,
        34,
        10,
        2,
        19,
        1,
        16,
        6,
        7,
        1,
        46,
        9,
        17,
        145,
        4,
        3,
        12,
        25,
        9,
        23,
        8,
        66,
        74,
        12,
        7,
        42,
        10,
        60,
      ],
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
      "chapters": [
        22,
        25,
        22,
        31,
        23,
        30,
        29,
        28,
        35,
        29,
        10,
        51,
        22,
        31,
        27,
        36,
        16,
        27,
        25,
        26,
        37,
        30,
        33,
        18,
        40,
        37,
        21,
        43,
        46,
        38,
        18,
        35,
        23,
        35,
        35,
        38,
        29,
        31,
        43,
        38,
      ],
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
      "chapters": [18, 41, 27, 30, 15, 7, 33, 24, 19, 22, 29, 37, 35, 31, 20],
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
      "chapters": [35, 25, 28, 21, 18, 30, 14, 26, 30, 34, 23, 39, 31, 35, 34],
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
      "chapters": [
        51,
        25,
        36,
        54,
        47,
        71,
        53,
        59,
        41,
        42,
        57,
        50,
        38,
        31,
        27,
        33,
        26,
        40,
        42,
        31,
        25,
      ],
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
      "chapters": [19, 30, 20, 16, 12, 22, 31, 13, 37],
    },
    chapter: undefined,
    ranges: [],
  });
});

Deno.test("Can pick up other symbols", () => {
  const ref = parseReference("1 Corinthians 12:12–27");

  assertEquals(ref, {
    book: {
      "name": "1 Corinthians",
      "path": "/study/scriptures/nt/1-cor",
      "abbr": "1 Cor.",
      "chapters": [
        31,
        16,
        23,
        21,
        13,
        20,
        40,
        13,
        27,
        33,
        34,
        31,
        13,
        40,
        58,
        24,
      ],
    },
    chapter: 12,
    ranges: [[12, 27]],
  });
});

Deno.test("Will show a single verse for an incomplete range", () => {
  const ref = parseReference("1 John 1:7-");

  assertEquals(ref, {
    book: {
      "name": "1 John",
      "path": "/study/scriptures/nt/1-jn",
      "abbr": "1 Jn.",
      "chapters": [10, 29, 24, 21, 21],
    },
    chapter: 1,
    ranges: [7],
  });
});

Deno.test("Will coerce a weird range", () => {
  const ref = parseReference("1 John 1:7-8-9");

  assertEquals(ref, {
    book: {
      "name": "1 John",
      "path": "/study/scriptures/nt/1-jn",
      "abbr": "1 Jn.",
      "chapters": [10, 29, 24, 21, 21],
    },
    chapter: 1,
    ranges: [7, 8, 9],
  });
});
