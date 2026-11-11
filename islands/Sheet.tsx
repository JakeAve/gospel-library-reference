import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { go, type View, view } from "./state.ts";
import { Icon } from "./Icons.tsx";
import RefView from "./RefView.tsx";
import ResultsView from "./ResultsView.tsx";
import FilterView from "./FilterView.tsx";
import { ChooseView, QrView } from "./ShareView.tsx";

function render(v: View) {
  switch (v.kind) {
    case "ref":
      return (
        <RefView
          key={v.r.reference}
          r={v.r}
          back={v.back}
          live={v.live}
        />
      );
    case "results":
      return <ResultsView />;
    case "filter":
      return <FilterView />;
    case "choose":
      return <ChooseView />;
    case "qr":
      return <QrView />;
  }
}

/**
 * The one sheet. Non-modal on purpose, so the search bar stays usable while
 * it's open; the scrim and Escape close it, and go(null) returns focus.
 */
export default function Sheet() {
  const v = view.value;
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = !!v;
  // A live reference follows the search bar, so typing keeps focus there.
  const takesFocus = isOpen && !(v.kind === "ref" && v.live);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && go(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (takesFocus) dialog.current?.focus();
  }, [takesFocus]);

  if (!v) return null;
  return (
    <>
      <div class="scrim" onClick={() => go(null)} />
      <dialog open ref={dialog} tabIndex={-1} class="sheet glass">
        <div class="grab" aria-hidden="true" />
        <div class="view">{render(v)}</div>
      </dialog>
    </>
  );
}

export function BackBtn(
  { label, onClick }: { label: string; onClick: () => void },
) {
  return (
    <button type="button" class="btn-subtle" onClick={onClick}>
      <Icon name="chevron-left" />
      {label}
    </button>
  );
}

/** Back link left, title centered, actions right. */
export function Head(
  { back, title, children }: {
    back?: ComponentChildren;
    title: string;
    children?: ComponentChildren;
  },
) {
  return (
    <div class="sheet-head">
      <div>{back}</div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
