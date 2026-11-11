import { effect, signal } from "@preact/signals";
import type { Reference, ReferenceMatch } from "@jakeave/scripture-ref/types";
import { parseRef } from "@jakeave/scripture-ref/client";
import { getAll, type RefWithId } from "../lib/indexedDB.ts";
import { findReference } from "../lib/findReference.ts";
import { determineTextType } from "../lib/determineTextType.ts";
import type { Filters } from "../lib/books.ts";
import {
  addFiltersToUrl,
  addFindToUrl,
  readFiltersFromURL,
  readFindFromURL,
} from "../lib/urlUpdater.ts";

export type View =
  | { kind: "ref"; r: Reference; back?: boolean }
  | { kind: "results" }
  | { kind: "filter" }
  | { kind: "choose" }
  | { kind: "qr" };

export const saved = signal<RefWithId[]>([]);
export const view = signal<View | null>(null);
export const query = signal(readFindFromURL());
export const filters = signal<Filters>(readFiltersFromURL());
export const results = signal<ReferenceMatch[]>([]);
export const status = signal<"idle" | "loading" | "more" | "error">("idle");
export const hasMore = signal(false);

/** Home only: keeps ?find= and the filter params in step with the UI. */
export function syncUrl() {
  const a = effect(() => addFindToUrl(query.value));
  const b = effect(() =>
    addFiltersToUrl(filters.value.volumes, filters.value.books)
  );
  return () => (a(), b());
}

export async function refreshSaved() {
  saved.value = await getAll();
}

export const findSaved = (r: Reference) =>
  saved.value.find((s) => s.reference === r.reference);

let opener: HTMLElement | null = null;

/** Opens, changes, or (with null) closes the sheet; views slide inside it. */
export function go(next: View | null, dir: "fwd" | "back" = "fwd") {
  if (!view.peek() && next) opener = document.activeElement as HTMLElement;
  const apply = () => {
    view.value = next;
    if (!next) {
      opener?.focus();
      opener = null;
    }
  };
  if (!view.peek() || !next || !("startViewTransition" in document)) {
    return apply();
  }
  document.documentElement.dataset.dir = dir;
  // Preact re-renders on a later tick; resolve after it so the new view is captured.
  document.startViewTransition(() => {
    apply();
    return new Promise((r) => setTimeout(r));
  });
}

const PAGE = 5;
let searchedKey = "";
let token = 0;
const key = () => JSON.stringify([query.value.trim(), filters.value]);

/** A reference (has a number, under four words) opens it; anything else searches words. */
export function submit() {
  const q = query.value.trim();
  if (!q) return;
  if (/\d/.test(q) && determineTextType(q) === "reference") {
    return go({ kind: "ref", r: parseRef(q) });
  }
  go({ kind: "results" });
  search();
}

async function fetchPage(start: number) {
  return await findReference(query.value.trim(), {
    start,
    end: start + PAGE,
    ...filters.value,
  });
}

export async function search() {
  const mine = ++token;
  searchedKey = key();
  results.value = [];
  status.value = "loading";
  try {
    const page = await fetchPage(0);
    if (mine !== token) return;
    results.value = page;
    hasMore.value = page.length === PAGE;
    status.value = "idle";
  } catch {
    if (mine === token) status.value = "error";
  }
}

export async function more() {
  const mine = token;
  status.value = "more";
  try {
    const page = await fetchPage(results.value.length);
    if (mine !== token) return;
    results.value = [...results.value, ...page];
    hasMore.value = page.length === PAGE;
    status.value = "idle";
  } catch {
    if (mine === token) status.value = "error";
  }
}

/** Back to results from the filter; searches again only if something changed. */
export function backToResults() {
  go({ kind: "results" }, "back");
  if (key() !== searchedKey) search();
}
