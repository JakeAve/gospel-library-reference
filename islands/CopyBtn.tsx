import { IS_BROWSER } from "$fresh/runtime.ts";

interface Props {
  link: string;
  text?: string;
}

export function CopyBtn(props: Props) {
  const { link, text } = props;

  if (!IS_BROWSER) {
    return <></>;
  }

  function copy() {
    const items: Record<string, Blob> = {
      "text/plain": new Blob([link], { type: "text/plain" }),
    };

    if (text) {
      const aTag = document.createElement("a");
      aTag.innerText = text;
      aTag.href = link;

      items["text/html"] = new Blob([aTag.outerHTML], {
        type: "text/html",
      });
    }

    const clipboardItem = new ClipboardItem(items);

    navigator.clipboard.write([clipboardItem])
      .catch(() => alert("Error copying"));
  }

  return <button type="button" onClick={copy}>Copy</button>;
}
