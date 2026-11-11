export interface Filters {
  volumes: string[];
  books: string[];
}

export interface Volume {
  id: string;
  name: string;
  books: string[];
}

export const VOLUMES: Volume[] = [
  {
    id: "ot",
    name: "Old Testament",
    books: [
      "Genesis",
      "Exodus",
      "Leviticus",
      "Numbers",
      "Deuteronomy",
      "Joshua",
      "Judges",
      "Ruth",
      "1 Samuel",
      "2 Samuel",
      "1 Kings",
      "2 Kings",
      "1 Chronicles",
      "2 Chronicles",
      "Ezra",
      "Nehemiah",
      "Esther",
      "Job",
      "Psalms",
      "Proverbs",
      "Ecclesiastes",
      "Song of Solomon",
      "Isaiah",
      "Jeremiah",
      "Lamentations",
      "Ezekiel",
      "Daniel",
      "Hosea",
      "Joel",
      "Amos",
      "Obadiah",
      "Jonah",
      "Micah",
      "Nahum",
      "Habakkuk",
      "Zephaniah",
      "Haggai",
      "Zechariah",
      "Malachi",
    ],
  },
  {
    id: "nt",
    name: "New Testament",
    books: [
      "Matthew",
      "Mark",
      "Luke",
      "John",
      "Acts",
      "Romans",
      "1 Corinthians",
      "2 Corinthians",
      "Galatians",
      "Ephesians",
      "Philippians",
      "Colossians",
      "1 Thessalonians",
      "2 Thessalonians",
      "1 Timothy",
      "2 Timothy",
      "Titus",
      "Philemon",
      "Hebrews",
      "James",
      "1 Peter",
      "2 Peter",
      "1 John",
      "2 John",
      "3 John",
      "Jude",
      "Revelation",
    ],
  },
  {
    id: "bom",
    name: "Book of Mormon",
    books: [
      "1 Nephi",
      "2 Nephi",
      "Jacob",
      "Enos",
      "Jarom",
      "Omni",
      "Words of Mormon",
      "Mosiah",
      "Alma",
      "Helaman",
      "3 Nephi",
      "4 Nephi",
      "Mormon",
      "Ether",
      "Moroni",
    ],
  },
  {
    id: "dc",
    name: "Doctrine and Covenants",
    books: ["Doctrine and Covenants"],
  },
  {
    id: "pgp",
    name: "Pearl of Great Price",
    books: [
      "Moses",
      "Abraham",
      "Joseph Smith—Matthew",
      "Joseph Smith—History",
      "Articles of Faith",
    ],
  },
];

const byId = Object.fromEntries(VOLUMES.map((v) => [v.id, v]));

export function volumeState(
  f: Filters,
  id: string,
): { checked: boolean | "mixed"; count: number } {
  const v = byId[id];
  if (f.volumes.includes(id)) return { checked: true, count: v.books.length };
  const count = v.books.filter((b) => f.books.includes(b)).length;
  return {
    checked: count === 0 ? false : count === v.books.length ? true : "mixed",
    count,
  };
}

export const isBookOn = (f: Filters, id: string, book: string) =>
  f.volumes.includes(id) || f.books.includes(book);

/** Whole volume on (sent as the volume ID) or off. */
export function toggleVolume(f: Filters, id: string): Filters {
  const v = byId[id];
  const books = f.books.filter((b) => !v.books.includes(b));
  const on = volumeState(f, id).checked === true;
  return {
    volumes: on ? f.volumes.filter((x) => x !== id) : [...f.volumes, id],
    books,
  };
}

/** Toggles one book; a volume whose books are all on collapses to its ID. */
export function toggleBook(f: Filters, id: string, book: string): Filters {
  const v = byId[id];
  let { volumes, books } = f;
  if (volumes.includes(id)) {
    volumes = volumes.filter((x) => x !== id);
    books = [...books, ...v.books.filter((b) => b !== book)];
  } else if (books.includes(book)) {
    books = books.filter((b) => b !== book);
  } else {
    books = [...books, book];
  }
  if (v.books.every((b) => books.includes(b))) {
    books = books.filter((b) => !v.books.includes(b));
    volumes = [...volumes, id];
  }
  return { volumes, books };
}

/** "All books", a volume or book name, or "Ether +1". */
export function filterLabel(f: Filters): string {
  const names = [
    ...f.volumes.map((id) => byId[id]?.name ?? id),
    ...f.books,
  ];
  if (!names.length) return "All books";
  return names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`;
}
