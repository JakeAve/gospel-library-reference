import type { ReferenceMatch } from "@jakeave/scripture-ref/types";
import { findMatchIdxs } from "../lib/findMatchIdxs.ts";
import ReferenceLink from "./ReferenceLink.tsx";
import { CopyBtn } from "../islands/CopyBtn.tsx";

export default function FindResult(props: ReferenceMatch) {
  const {
    book,
    reference,
    abbr,
    link,
    content: rawContent,
    match,
  } = props;

  let abbrElem;

  if (book.name !== book.abbr) {
    abbrElem = <ReferenceLink text={abbr} link={link} />;
  }

  const longElem = <ReferenceLink text={reference} link={link} />;

  const content = rawContent as string;

  const idxs = findMatchIdxs({ content, match });

  let p = (
    <p class="col-span-2">
      <CopyBtn content={content} />&nbsp;
      {content}
    </p>
  );

  if (idxs?.length) {
    p = (
      <p class="col-span-2">
        <CopyBtn content={content} />&nbsp;
        {content.slice(0, idxs[0])}
        <span class="font-bold text-blue-500">
          {content.slice(idxs[0], idxs[1])}
        </span>
        {content.slice(idxs[1])}
      </p>
    );
  }

  return (
    <div class="grid gap-2 grid-cols-[auto_1fr] items-center justify-items-start">
      {p}
      {abbrElem}
      {longElem}
    </div>
  );
}
