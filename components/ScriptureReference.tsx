import { CopyBtn } from "../islands/CopyBtn.tsx";

interface Props {
  book: Book;
  chapter?: number;
  start?: number;
  end?: number;
  lang?: string;
  domain?: string;
}

export default function ScriptureReference(props: Props) {
  const {
    lang = "?lang=eng",
    domain = "https://www.churchofjesuschrist.org",
    book,
    chapter,
    start,
    end,
  } = props;

  const chapterPath = chapter ? "/" + chapter : "";
  const anchor = start ? "#" + start : "";
  let highlights = "";
  if (start) {
    highlights += "&id=p" + start;
  }
  if (start && end) {
    highlights += "-p" + end;
  }

  const link =
    `${domain}${book.path}${chapterPath}${lang}${highlights}${anchor}`;

  const numbers = `${chapter || ""}${start ? ":" + start : ""}${
    start && end ? "-" + end : ""
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
