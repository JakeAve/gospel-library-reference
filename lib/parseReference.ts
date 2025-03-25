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

  const bookText = input.slice(0, bookEndIdx).toLocaleLowerCase();

  const sorted = (paths as Book[]).toSorted((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    const abbrA = a.abbr.toLocaleLowerCase();
    const nameA = a.name.toLocaleLowerCase();

    const minA = Math.min(
      distance(abbrA, bookText),
      distance(nameA, bookText),
    );

    const abbrB = b.abbr.toLocaleLowerCase();
    const nameB = b.name.toLocaleLowerCase();

    const minB = Math.min(
      distance(abbrB, bookText),
      distance(nameB, bookText),
    );

    if (minA < minB) {
      scoreA += 50;
    }

    if (minB < minA) {
      scoreB += 50;
    }

    if (nameA[0] === bookText[0]) {
      scoreA += 10;
      if (nameA[1] === bookText[1]) {
        scoreA += 20;
        if (nameA[2] === bookText[2]) {
          scoreA += 50;
        }
      }
    }

    if (nameB[0] === bookText[0]) {
      scoreB += 15;
      if (nameB[1] === bookText[1]) {
        scoreB += 20;
        if (nameB[2] === bookText[2]) {
          scoreB += 50;
        }
      }
    }

    const dA = Math.min(
      Math.abs(abbrA.length - bookText.length),
      Math.abs(nameA.length - bookText.length),
    );

    const dB = Math.min(
      Math.abs(abbrB.length - bookText.length),
      Math.abs(nameB.length - bookText.length),
    );

    if (dA < dB) {
      scoreA += 5;
    }

    if (dB < dA) {
      scoreB += 5;
    }

    if (scoreA < scoreB) {
      return 1;
    }

    if (scoreB < scoreA) {
      return -1;
    }

    return 0;
  });

  const book = sorted[0];

  if (chapter && book?.chapters?.length && book.chapters.length < chapter) {
    chapter = undefined;
    ranges.length = 0;
  }

  if (!chapter && book?.chapters?.length && book.chapters.length === 1) {
    chapter = 1;
  }

  return {
    book,
    chapter,
    ranges,
  };
}
