import { CopyBtn } from "../islands/CopyBtn.tsx";

interface Props {
  book: Book;
  chapter?: number;
  ranges: VerseRange;
  lang?: string;
  domain?: string;
}

export default function ScriptureReference(props: Props) {
  const {
    lang = "?lang=eng",
    domain = "https://www.churchofjesuschrist.org",
    book,
    chapter,
    ranges,
  } = props;

  const chapterPath = chapter ? "/" + chapter : "";

  const firstRange = ranges[0];
  const anchor = firstRange
    ? "#p" +
      (Array.isArray(firstRange)
        ? (firstRange as [number, number])[0]
        : firstRange)
    : "";

  const ps: string[] = [];
  const verses: string[] = [];
  for (const r of ranges) {
    if (Array.isArray(r)) {
      ps.push(`p${r[0]}-p${r[1]}`);
      verses.push(`${r[0]}-${r[1]}`);
    } else {
      ps.push(`p${r}`);
      verses.push(r.toString());
    }
  }

  const highlights = ranges.length ? "&id=" + ps.join(",") : "";

  const link =
    `${domain}${book.path}${chapterPath}${lang}${highlights}${anchor}`;

  const numbers = `${chapter || ""}${verses.length ? ":" : ""}${
    verses.join(", ")
  }`;

  const long = `${book.name} ${numbers}`.trim();

  let abbrElem = <></>;

  if (book.name !== book.abbr) {
    const abbr = `${book.abbr} ${numbers}`.trim();
    abbrElem = (
      <div>
        <a href={link}>{abbr}</a> <CopyBtn link={link} text={abbr} />
      </div>
    );
  }

  return (
    <div>
      {abbrElem}
      <div>
        <a href={link}>{long}</a> <CopyBtn link={link} text={long} />
      </div>
      <div>
        {link} <CopyBtn link={link} />
      </div>
    </div>
  );
}
