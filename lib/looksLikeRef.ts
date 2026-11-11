import type { Reference } from "@jakeave/scripture-ref/types";
import { distance } from "fastest-levenshtein";
import { determineTextType } from "./determineTextType.ts";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * parseRef always returns its closest book, even for "faith hope", so this
 * decides whether `input` was meant as a reference to `ref`. Under four words,
 * and the text before the chapter starts like the book's name or abbreviation:
 * 3+ letters ("alm"), an exact abbreviation ("ps", "d&c"), or any prefix once a
 * chapter is typed ("2 n 3"). With a chapter, two typos are allowed ("1 nefi 3").
 * The thresholds keep the first letters of a quote ("je…", "beho…") from
 * flashing a book.
 */
export function looksLikeRef(input: string, ref: Reference): boolean {
  if (!input.trim() || determineTextType(input) === "query") return false;
  // Same split as parseRef: an optional leading number, then the book words.
  const head = input.match(/^\s*(\d\s*)?[^\d:]*/)![0];
  const bookText = norm(head);
  const letters = bookText.replace(/^\d+/, "");
  if (!letters) return false;
  const hasChapter = /\d/.test(input.slice(head.length));
  return [ref.book.name, ref.book.abbr].map(norm).some((b) =>
    (b.startsWith(bookText) &&
      (letters.length >= 3 || hasChapter || b === bookText)) ||
    (hasChapter && bookText.length >= 4 && distance(b, bookText) <= 2)
  );
}
