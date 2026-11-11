export interface Clip {
  plain: string;
  html?: string;
}

const esc = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

/**
 * A pretty link: `<a href=url>label</a>` as HTML, the URL as plain text.
 * With `before` (the verse), both carry it ahead of the link.
 */
export function linkClip(label: string, url: string, before = ""): Clip {
  const a = `<a href="${esc(url)}">${esc(label)}</a>`;
  return before
    ? { plain: `${before} ${label} ${url}`, html: `${esc(before)} ${a}` }
    : { plain: url, html: a };
}

export function writeClip(clip: Clip): Promise<void> {
  const items: Record<string, Blob> = {
    "text/plain": new Blob([clip.plain], { type: "text/plain" }),
  };
  if (clip.html) {
    items["text/html"] = new Blob([clip.html], { type: "text/html" });
  }
  return navigator.clipboard.write([new ClipboardItem(items)]);
}
