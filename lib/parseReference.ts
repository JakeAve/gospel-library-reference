import paths from "../data/books.json" with { type: "json" };
import { distance } from "./levanstein.ts";

export function parseReference(
  input: string,
): Reference {
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

  const colonIdx = /:/.exec(input)?.index;
  const ranges: VerseRange = [];

  if (colonIdx && colonIdx > 0) {
    const vStrings = input.slice(colonIdx + 1);
    const verses = vStrings.split(",");

    for (const v of verses) {
      if (v.match(/-|–/)) {
        const vNums = v.match(/\d+/g);
        if (vNums) {
          const range: number[] = [];
          for (const vn of vNums) {
            range.push(Number(vn));
          }
          ranges.push(range.toSorted((a, b) => a - b) as [number, number]);
        }
      } else if (v) {
        const vNum = v.match(/\d+/);
        ranges.push(Number(vNum));
      }
    }

    ranges.sort((a, b) => {
      const minA = Math.min(Array.isArray(a) ? (a[0], a[1]) : a);
      const minB = Math.min(Array.isArray(b) ? (b[0], b[1]) : b);

      if (minA > minB) {
        return 1;
      }
      if (minA < minB) {
        return -1;
      }
      return 0;
    });
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
    ranges,
  };
}
