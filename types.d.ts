interface Book {
  name: string;
  path: string;
  abbr: string;
  chapters?: number;
}

type VerseRange = (number | [number, number])[];
