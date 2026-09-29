import { parseRef } from "@jakeave/scripture-ref/client";
import { assertEquals } from "@std/assert";
import {
  isShareable,
  move,
  reconcile,
  type ShareRow,
  shareUrl,
} from "./shareList.ts";

Deno.test("reconcile: first open with empty rows", () => {
  const result = reconcile([], [3, 1]);
  assertEquals(result, [{ id: 3, on: true }, { id: 1, on: true }]);
});

Deno.test("reconcile: drops rows no longer saved", () => {
  const rows: ShareRow[] = [{ id: 1, on: false }, { id: 2, on: true }];
  const result = reconcile(rows, [1]);
  assertEquals(result, [{ id: 1, on: false }]);
});

Deno.test("reconcile: appends new ids in savedIds order", () => {
  const rows: ShareRow[] = [{ id: 1, on: false }];
  const result = reconcile(rows, [1, 5, 4]);
  assertEquals(result, [
    { id: 1, on: false },
    { id: 5, on: true },
    { id: 4, on: true },
  ]);
});

Deno.test("reconcile: preserves existing row order for kept ids", () => {
  const rows: ShareRow[] = [
    { id: 2, on: true },
    { id: 1, on: false },
    { id: 3, on: true },
  ];
  const result = reconcile(rows, [1, 2, 3]);
  assertEquals(result, rows);
});

Deno.test("move: up", () => {
  assertEquals(move([1, 2, 3, 4], 3, 0), [4, 1, 2, 3]);
});

Deno.test("move: down", () => {
  assertEquals(move([1, 2, 3, 4], 0, 3), [2, 3, 4, 1]);
});

Deno.test("move: same index is a no-op", () => {
  assertEquals(move([1, 2, 3], 1, 1), [1, 2, 3]);
});

Deno.test("isShareable: false for a titlepage-only ref", () => {
  assertEquals(isShareable(parseRef("Alma")), false);
});

Deno.test("isShareable: true for a verse ref", () => {
  assertEquals(isShareable(parseRef("Alma 32:21")), true);
});

Deno.test("shareUrl: default lowercase", () => {
  assertEquals(
    shareUrl("https://gospellibrary.link", "12345"),
    "https://gospellibrary.link/s/12345",
  );
});

Deno.test("shareUrl: qr uppercases host and path, keeps digits", () => {
  assertEquals(
    shareUrl("https://gospellibrary.link", "12345", { qr: true }),
    "HTTPS://GOSPELLIBRARY.LINK/S/12345",
  );
});

Deno.test("shareUrl: qr keeps a dev origin's port", () => {
  assertEquals(
    shareUrl("http://localhost:5173", "12345", { qr: true }),
    "HTTP://LOCALHOST:5173/S/12345",
  );
});
