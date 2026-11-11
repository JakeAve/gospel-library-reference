import { assertEquals } from "@std/assert";
import { filterLabel, toggleBook, toggleVolume, volumeState } from "./books.ts";

const none = { volumes: [], books: [] };

Deno.test("toggleVolume selects the volume ID and drops its books", () => {
  const f = toggleVolume({ volumes: [], books: ["Ether", "Genesis"] }, "bom");
  assertEquals(f, { volumes: ["bom"], books: ["Genesis"] });
  assertEquals(toggleVolume(f, "bom"), { volumes: [], books: ["Genesis"] });
});

Deno.test("toggleBook inside a selected volume keeps the rest of it", () => {
  const f = toggleBook({ volumes: ["pgp"], books: [] }, "pgp", "Moses");
  assertEquals(f.volumes, []);
  assertEquals(f.books.length, 4);
  assertEquals(volumeState(f, "pgp"), { checked: "mixed", count: 4 });
});

Deno.test("toggleBook collapses a full volume to its ID", () => {
  assertEquals(toggleBook(none, "dc", "Doctrine and Covenants"), {
    volumes: ["dc"],
    books: [],
  });
});

Deno.test("filterLabel", () => {
  assertEquals(filterLabel(none), "All books");
  assertEquals(
    filterLabel({ volumes: ["nt"], books: [] }),
    "New Testament",
  );
  assertEquals(
    filterLabel({ volumes: [], books: ["Ether", "Moroni"] }),
    "Ether +1",
  );
});
