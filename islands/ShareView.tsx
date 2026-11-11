import { signal } from "@preact/signals";
import { useLayoutEffect, useRef } from "preact/hooks";
import { generate } from "lean-qr";
import { toSvgDataURL } from "lean-qr/extras/svg";
import { encode } from "../lib/refCodec.ts";
import {
  isShareable,
  move,
  reconcile,
  type ShareRow,
  shareUrl,
} from "../lib/shareList.ts";
import { go, saved } from "./state.ts";
import { Icon } from "./Icons.tsx";
import { showMessage } from "./Toast.tsx";
import { BackBtn, Head } from "./Sheet.tsx";
import { Check } from "./FilterView.tsx";

// Module-level so the pick and order survive close/reopen (not reload).
const rows = signal<ShareRow[]>([]);

const plural = (n: number) => `${n} reference${n === 1 ? "" : "s"}`;

export function openShare() {
  rows.value = reconcile(rows.value, saved.value.map((r) => r.id).reverse());
  go({ kind: "choose" });
}

function picked() {
  const byId = new Map(saved.value.map((r) => [r.id, r]));
  return rows.value
    .map((row) => row.on ? byId.get(row.id) : undefined)
    .filter((r) => r && isShareable(r))
    .map((r) => r!);
}

export function ChooseView() {
  const list = useRef<HTMLOListElement>(null);
  const dragFrom = useRef<number | null>(null);
  const focusId = useRef<number | null>(null);
  const byId = new Map(saved.value.map((r) => [r.id, r]));
  const shareable = rows.value.filter((row) => {
    const r = byId.get(row.id);
    return r && isShareable(r);
  });
  const count = picked().length;
  const allOn = count === shareable.length;

  useLayoutEffect(() => {
    if (focusId.current === null) return;
    list.current?.querySelector<HTMLElement>(
      `[data-handle="${focusId.current}"]`,
    )?.focus();
    focusId.current = null;
  });

  function onPointerDown(e: PointerEvent) {
    const handle = (e.target as Element).closest<HTMLElement>("[data-handle]");
    if (!handle) return;
    dragFrom.current = rows.value.findIndex((r) =>
      String(r.id) === handle.dataset.handle
    );
    // Capture on the list, not the handle: keyed reorders move the handle's
    // DOM node, which would drop the capture.
    list.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    const from = dragFrom.current;
    if (from === null || !list.current) return;
    const to = [...list.current.children].findIndex((el) => {
      const r = el.getBoundingClientRect();
      return e.clientY >= r.top && e.clientY < r.bottom;
    });
    if (to === -1 || to === from) return;
    rows.value = move(rows.value, from, to);
    dragFrom.current = to;
  }

  function onHandleKey(e: KeyboardEvent, i: number) {
    const delta = { ArrowUp: -1, ArrowDown: 1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const to = i + delta;
    if (to < 0 || to >= rows.value.length) return;
    focusId.current = rows.value[i].id;
    rows.value = move(rows.value, i, to);
  }

  const setAll = (on: boolean) =>
    rows.value = rows.value.map((r) => ({ ...r, on }));

  return (
    <>
      <Head title="Share" />
      <div class="bar">
        <span class="note" aria-live="polite">
          {count} of {shareable.length} picked
        </span>
        <button
          type="button"
          class="btn-subtle"
          onClick={() => setAll(!allOn)}
        >
          {allOn ? "Select none" : "Select all"}
        </button>
      </div>
      <div class="sheet-body">
        <ol
          ref={list}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => dragFrom.current = null}
          onPointerCancel={() => dragFrom.current = null}
        >
          {rows.value.map((row, i) => {
            const ref = byId.get(row.id);
            if (!ref) return null;
            const ok = isShareable(ref);
            return (
              <li key={row.id} class={ok ? "pick" : "pick off"}>
                <button
                  type="button"
                  class="grip"
                  data-handle={row.id}
                  aria-label={`Reorder ${ref.reference}`}
                  title="Drag, or use the arrow keys, to reorder"
                  onKeyDown={(e) => onHandleKey(e, i)}
                >
                  <Icon name="grip" />
                </button>
                <span class="pick-label">
                  {ref.reference}
                  {!ok && (
                    <span class="reason">· Whole books can't be shared</span>
                  )}
                </span>
                {ok && (
                  <Check
                    checked={row.on}
                    label={`Share ${ref.reference}`}
                    onClick={() =>
                      rows.value = rows.value.map((r) =>
                        r.id === row.id ? { ...r, on: !r.on } : r
                      )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div class="sheet-foot">
        <button
          type="button"
          class="btn-primary"
          onClick={() =>
            count ? go({ kind: "qr" }) : showMessage("Pick a reference first")}
        >
          Show QR for {plural(count)}
        </button>
      </div>
    </>
  );
}

export function QrView() {
  const refs = picked();
  const url = shareUrl(location.origin, encode(refs));
  const qrUrl = shareUrl(location.origin, encode(refs), { qr: true });

  function copy() {
    navigator.clipboard.writeText(url).then(
      () => showMessage("Copied link"),
      () => showMessage("Couldn't copy"),
    );
  }

  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: "Scripture references", url });
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") copy();
    }
  }

  return (
    <>
      <Head
        back={
          <BackBtn
            label="Choose"
            onClick={() => go({ kind: "choose" }, "back")}
          />
        }
        title={plural(refs.length)}
      />
      <div class="sheet-body">
        <figure class="qr">
          <div
            class="qr-code"
            role="img"
            aria-label="QR code for the shared list"
            style={{
              "--qr": `url("${
                toSvgDataURL(generate(qrUrl), {
                  on: "black",
                  off: "transparent",
                  pad: 4,
                })
              }")`,
            }}
          />
        </figure>
        <ol class="qr-list">
          {refs.map((r) => <li key={r.id}>{r.reference}</li>)}
        </ol>
        <p class="url">{url}</p>
      </div>
      <div class="sheet-foot">
        <button type="button" class="btn-subtle" onClick={copy}>
          Copy link
        </button>
        <button type="button" class="btn-primary" onClick={share}>
          Share…
        </button>
      </div>
    </>
  );
}
