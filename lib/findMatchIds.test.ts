import { assertEquals } from "$std/assert/mod.ts";
import { findMatchIdxs } from "./findMatchIdxs.ts";

Deno.test("Will match", () => {
  const idxs = findMatchIdxs(
    {
      content:
        "And if any man will hurt them, fire proceedeth out of their mouth, and devoureth their enemies: and if any man will hurt them, he must in this manner be killed.",
      match: "their mouth and devoureth their enemies".toUpperCase(),
    },
  );
  assertEquals(idxs, [54, 94]);
});

Deno.test("Matching with repeat words", () => {
  const idxs = findMatchIdxs(
    {
      content:
        "And inasmuch as thou shalt keep my commandments, thou shalt be made a ruler and a teacher over thy brethren. A",
      match: "a ruler and".toUpperCase(),
    },
  );
  assertEquals(idxs, [68, 79]);
});

Deno.test("Matching test", () => {
  const idxs = findMatchIdxs(
    {
      content:
        "And this is my doctrine, and it is the doctrine which the Father hath given unto me; and I bear record of the Father, and the Father beareth record of me, and the Holy Ghost beareth record of the Father and me; and I bear record that the Father commandeth all men, everywhere, to repent and believe in me.",
      match: " AND THE HOLY GHOST",
    },
  );
  assertEquals(idxs, [118, 173]);
});

Deno.test("Another test", () => {
  const idxs = findMatchIdxs(
    {
      content:
        "And he will lift up an ensign to the nations from far, and will hiss unto them from the end of the earth: and, behold, they shall come with speed swiftly:",
      match: "BEHOLD THEY SHALL",
    },
  );
  assertEquals(idxs, [111, 129]);
});

Deno.test("Get one word", () => {
  const idxs = findMatchIdxs(
    {
      content:
        "And now, my son, I have somewhat to say concerning the thing which our fathers call a ball, or director--or our fathers called it Liahona, which is, being interpreted, a compass; and the Lord prepared it.",
      match: " LIAHONA",
    },
  );
  assertEquals(idxs, [130, 137]);
});

Deno.test("when phrases are repeated", () => {
  findMatchIdxs(
    {
      content:
        "And after this manner shall ye baptize in my name; for behold, verily I say unto you, that the Father, and the Son, and the Holy Ghost are one; and I am in the Father, and the Father in me, and the Father and I are one.",
      match: "THE FATHER AND I ARE ONE",
    },
  );
  // TODO: This case will have an early startIdx
});
