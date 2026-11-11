import { effect, signal } from "@preact/signals";
import type { Reference, ReferenceMatch } from "@jakeave/scripture-ref/types";
import { parseRef } from "@jakeave/scripture-ref/client";
import { getAll, type RefWithId } from "../lib/indexedDB.ts";
import { findReference } from "../lib/findReference.ts";
import { looksLikeRef } from "../lib/looksLikeRef.ts";
import type { Filters } from "../lib/books.ts";
import {
  addFiltersToUrl,
  addFindToUrl,
  readFiltersFromURL,
  readFindFromURL,
} from "../lib/urlUpdater.ts";

export type View =
  | {
    kind: "ref";
    r: Reference;
    back?: boolean;
    live?: boolean;
    typed?: boolean;
  }
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
/** A sheet that came from the search bar shrinks to its title bar instead of closing. */
export const minimized = signal(false);

/** Views the search bar opened; they stay (minimized) until the bar is cleared. */
export const fromSearch = (v: View | null) =>
  v?.kind === "results" ||
  (v?.kind === "ref" && !!(v.live || v.back || v.typed));

/** Scrim and Escape: minimize a search sheet, close any other. */
export function dismiss() {
  if (fromSearch(view.peek())) minimized.value = true;
  else go(null);
}

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
  minimized.value = false;
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

/** The reference `q` names, or null when it reads as a quote. */
export function asRef(q: string): Reference | null {
  const r = parseRef(q);
  return looksLikeRef(q, r) ? r : null;
}

const isLive = (v: View | null) => v?.kind === "ref" && !!v.live;

/**
 * Home only: as you type a reference, the sheet shows it, updating in place;
 * when the text stops reading as a reference, the live sheet closes.
 */
export function liveRef() {
  return effect(() => {
    const r = asRef(query.value);
    const v = view.peek();
    if (r) {
      if (isLive(v)) {
        view.value = { kind: "ref", r, live: true };
        minimized.value = false;
      } else go({ kind: "ref", r, live: true });
    } else if (isLive(v) || (!query.value.trim() && fromSearch(v))) go(null);
  });
}

/** Enter: commits the reference being shown, or searches the words. */
export function submit() {
  const q = query.value.trim();
  if (!q) return;
  const r = asRef(q);
  if (r) {
    if (view.peek()) {
      view.value = { kind: "ref", r, typed: true };
      minimized.value = false;
    } else go({ kind: "ref", r, typed: true });
    return;
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

// The last /s/ list opened, so Home can link back to it. A QR scan opens a new
// tab or the installed app, where Back can't reach it (iOS standalone has none).
// ponytail: one list only; keep a short history if teachers share several.
const SHARED_KEY = "lastShared";
export const lastShared = signal<string | null>(store());
function store(digits?: string | null) {
  try {
    if (digits === undefined) return localStorage.getItem(SHARED_KEY);
    if (digits) localStorage.setItem(SHARED_KEY, digits);
    else localStorage.removeItem(SHARED_KEY);
  } catch { /* private mode: the link just won't persist */ }
  return digits ?? null;
}
export const rememberShared = (digits: string | null) =>
  lastShared.value = store(digits);
