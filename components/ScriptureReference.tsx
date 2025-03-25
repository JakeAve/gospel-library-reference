import { CopyBtn } from "../islands/CopyBtn.tsx";

interface Props extends Reference {
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

  let abbrElem;

  if (book.name !== book.abbr) {
    const abbr = `${book.abbr} ${numbers}`.trim();
    abbrElem = (
      <>
        <CopyBtn link={link} text={abbr} />
        <a
          class="flex items-center gap-1"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="underline">{abbr}</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="currentColor"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
          </svg>
        </a>
      </>
    );
  }

  return (
    <div class="grid gap-2 grid-cols-[auto_1fr] items-center justify-items-start">
      {abbrElem}
      <CopyBtn link={link} text={long} />
      <a
        class="flex items-center gap-1"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="underline">{long}</span>{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
          fill="currentColor"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
        </svg>
      </a>
      <CopyBtn link={link} /> <span class="text-sm break-all">{link}</span>
    </div>
  );
}
