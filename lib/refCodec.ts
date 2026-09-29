import { parseRef } from "@jakeave/scripture-ref/client";
import type { Reference } from "@jakeave/scripture-ref/types";
import { CANON } from "./canon.ts";

// One slot per chapter (or per chapterless page). A slot owns n + 1 units:
// the whole chapter, then one per verse. A chapterless page has n = 0.
type Slot = { name: string; ch?: number; n: number; base: number };

const SLOTS: Slot[] = [];
const byKey = new Map<string, Slot>();
let UNITS = 0;
for (const { name, chapters } of CANON) {
  (chapters ?? [0]).forEach((n, i) => {
    const slot = { name, ch: chapters && i + 1, n, base: UNITS };
    SLOTS.push(slot);
    byKey.set(`${name} ${slot.ch ?? ""}`, slot);
    UNITS += n + 1;
  });
}

function spansOf(ref: Reference, n: number): [number, number][] {
  const sorted = ref.verses
    .map((v): [number, number] => typeof v === "number" ? [v, v] : [...v])
    .sort((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  for (const [a, b] of sorted) {
    if (
      !Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > n
    ) {
      throw new RangeError(`Verse out of range: ${ref.reference}`);
    }
    const last = out.at(-1);
    if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
}

/** Packs refs into a mixed-radix number, least-significant field first. */
export function encode(refs: Reference[]): string {
  const fields: [number, number][] = []; // [value, radix]
  for (const ref of refs) {
    const slot = byKey.get(`${ref.book.name} ${ref.chapter ?? ""}`);
    if (!slot) throw new RangeError(`Not in canon: ${ref.reference}`);
    const { n, base } = slot;
    const spans = spansOf(ref, n);
    if (!spans.length) fields.push([base + 1, UNITS + 1]);
    let prevEnd = 0;
    spans.forEach(([a, b], i) => {
      if (i === 0) fields.push([base + a + 1, UNITS + 1]);
      else fields.push([a - prevEnd - 2, n - prevEnd - 1]);
      fields.push([b - a, n - a + 1]);
      if (b < n - 1) fields.push([i < spans.length - 1 ? 1 : 0, 2]);
      prevEnd = b;
    });
  }
  let num = 0n;
  for (const [v, r] of fields.reverse()) num = num * BigInt(r) + BigInt(v);
  return num ? num.toString() : "";
}

export function decode(digits: string): Reference[] {
  if (!/^\d*$/.test(digits)) throw new RangeError("Not a digit string");
  let num = BigInt(digits || 0);
  const take = (radix: number) => {
    const r = BigInt(radix);
    const v = Number(num % r);
    num /= r;
    return v;
  };
  const refs: Reference[] = [];
  while (num > 0n) {
    const unit = take(UNITS + 1) - 1;
    if (unit < 0) throw new RangeError("Unit past the end of the list");
    const { name, ch, n, base } = SLOTS.findLast((s) => s.base <= unit)!;
    let text = ch ? `${name} ${ch}` : name;
    let start = unit - base; // 0 = whole chapter
    if (start) {
      const spans: string[] = [];
      while (true) {
        const end = start + take(n - start + 1);
        spans.push(start === end ? `${start}` : `${start}-${end}`);
        if (end >= n - 1 || !take(2)) break;
        start = end + 2 + take(n - end - 1);
      }
      text += `:${spans.join(", ")}`;
    }
    refs.push(parseRef(text));
  }
  return refs;
}
