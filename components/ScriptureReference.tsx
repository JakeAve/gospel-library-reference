import { Reference } from "@jakeave/scripture-ref/types";
import { CopyBtn } from "../islands/CopyBtn.tsx";
import ReferenceContent from "../islands/ReferenceContent.tsx";
import ReferenceLink from "./ReferenceLink.tsx";

interface Props extends Reference {
  id?: number;
}

export default function ScriptureReference(props: Props) {
  const {
    book,
    reference,
    abbr,
    link,
    api,
    id,
    content,
  } = props;

  let abbrElem;

  if (book.name !== book.abbr) {
    abbrElem = <ReferenceLink text={abbr} link={link} />;
  }

  const longElem = <ReferenceLink text={reference} link={link} />;

  return (
    <div class="grid gap-2 grid-cols-[auto_1fr] items-center justify-items-start">
      {abbrElem}
      {longElem}
      <CopyBtn content={link} /> <span class="text-xs break-all">{link}</span>
      {!!api && (
        <ReferenceContent key={api} api={api} id={id} content={content} />
      )}
    </div>
  );
}
