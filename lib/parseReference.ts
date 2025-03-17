import paths from "../data/books.json" with { type: "json" };
import { distance } from "./levanstein.ts";

export function parseReference(
  input: string,
): {
  book: Book;
  chapter: number | undefined;
  start: number | undefined;
  end: number | undefined;
} {
  input = input.trim();
  const digits = [...input.matchAll(/\d+/g)];

  let chapter: undefined | number;

  if (digits.length) {
    if (digits[0].index === 0) {
      chapter = Number(digits[1]);
    } else {
      chapter = Number(digits[0]);
    }
  }

  let start: undefined | number;
  const stMatches = input.match(/:(\d+)/);

  if (stMatches?.length) {
    start = Number(stMatches[1]);
  }

  let end: undefined | number;
  const endMatches = input.match(/:\d+.+?(\d+)/);

  if (endMatches?.length) {
    end = Number(endMatches[1]);
  }

  const bookEndIdx = digits.length ? digits[1]?.index : undefined;

  const bookText = input.slice(0, bookEndIdx);

  const sorted = (paths as Book[]).toSorted((a, b) => {
    const minA = Math.min(
      distance(a.abbr, bookText),
      distance(a.name, bookText),
    );
    const minB = Math.min(
      distance(b.abbr, bookText),
      distance(b.name, bookText),
    );

    if (minA > minB) {
      return 1;
    }
    if (minA < minB) {
      return -1;
    }
    return 0;
  });

  const book = sorted[0];

  if (book.chapters === 1) {
    chapter = 1;
  }

  return {
    book,
    chapter,
    start,
    end,
  };
}
