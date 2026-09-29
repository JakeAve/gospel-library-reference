import type { Reference } from "@jakeave/scripture-ref/types";
import { encode } from "./refCodec.ts";

export interface ShareRow {
  id: number;
  on: boolean;
}

/**
 * Reconciles the dialog's rows against the saved ids (oldest-first).
 * Existing rows keep their order for ids still saved; the rest are dropped;
 * new ids are appended, in savedIds order, as `on: true`.
 */
export function reconcile(rows: ShareRow[], savedIds: number[]): ShareRow[] {
  const saved = new Set(savedIds);
  const existingIds = new Set(rows.map((r) => r.id));
  const kept = rows.filter((r) => saved.has(r.id));
  const added = savedIds
    .filter((id) => !existingIds.has(id))
    .map((id): ShareRow => ({ id, on: true }));
  return [...kept, ...added];
}

/** Returns a new array with the item at `from` moved to index `to`. */
export function move<T>(list: T[], from: number, to: number): T[] {
  const copy = list.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/** `origin` is the page's own (`location.origin`), so links work in any env. */
export function shareUrl(
  origin: string,
  digits: string,
  opts?: { qr?: boolean },
): string {
  const url = `${origin}/s/${digits}`;
  return opts?.qr ? url.slice(0, -digits.length).toUpperCase() + digits : url;
}

/** True when `ref` can be encoded into a share link. */
export function isShareable(ref: Reference): boolean {
  try {
    encode([ref]);
    return true;
  } catch {
    return false;
  }
}
