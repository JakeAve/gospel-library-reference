import { signal, useSignal } from "@preact/signals";
import { useLayoutEffect, useRef } from "preact/hooks";
import { generate } from "lean-qr";
import { toSvgDataURL } from "lean-qr/extras/svg";
import type { RefWithId } from "../lib/indexedDB.ts";
import { encode } from "../lib/refCodec.ts";
import {
  isShareable,
  move,
  reconcile,
  type ShareRow,
  shareUrl,
} from "../lib/shareList.ts";

// Module-level so the pick and order survive close/reopen (not reload).
const rows = signal<ShareRow[]>([]);

const pill =
  "min-h-11 px-5 rounded-full font-medium border-2 border-blue-600 dark:border-blue-400";
const outlined = `${pill} text-blue-600 dark:text-blue-400`;
const filled =
  `${pill} bg-blue-600 text-white dark:bg-blue-400 dark:text-neutral-900`;

const plural = (n: number) => `${n} reference${n === 1 ? "" : "s"}`;

export default function ShareDialog({ refs }: { refs: RefWithId[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const dragFrom = useRef<number | null>(null);
  const focusId = useRef<number | null>(null);
  const step = useSignal<"choose" | "qr">("choose");
  const copyState = useSignal<"" | "ok" | "fail">("");

  const byId = new Map(refs.map((r) => [r.id, r]));
  const checked = rows.value
    .map((row) => ({ row, ref: byId.get(row.id)! }))
    .filter(({ row, ref }) => ref && row.on && isShareable(ref))
    .map(({ ref }) => ref);

  useLayoutEffect(() => {
    if (focusId.current === null) return;
    dialog.current?.querySelector<HTMLElement>(
      `[data-handle="${focusId.current}"]`,
    )?.focus();
    focusId.current = null;
  });

  function open() {
    rows.value = reconcile(rows.value, refs.map((r) => r.id).reverse());
    step.value = "choose";
    dialog.current?.showModal();
  }

  function onPointerDown(e: PointerEvent) {
    const handle = (e.target as Element).closest("[data-handle]");
    if (!handle) return;
    dragFrom.current = rows.value.findIndex((r) =>
      String(r.id) === (handle as HTMLElement).dataset.handle
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

  function toggle(id: number) {
    rows.value = rows.value.map((r) => r.id === id ? { ...r, on: !r.on } : r);
  }

  const digits = step.value === "qr" ? encode(checked) : "";

  function copy() {
    navigator.clipboard.writeText(shareUrl(location.origin, digits)).then(
      () => {
        copyState.value = "ok";
        setTimeout(() => copyState.value = "", 1500);
      },
      () => {
        copyState.value = "fail";
        setTimeout(() => copyState.value = "", 1500);
      },
    );
  }

  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({
        title: "Scripture references",
        url: shareUrl(location.origin, digits),
      });
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") copy();
    }
  }

  return (
    <>
      <button
        type="button"
        class={`${outlined} flex items-center gap-2 text-sm`}
        onClick={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
        </svg>
        Share
      </button>
      <dialog
        ref={dialog}
        class="w-full h-full max-w-none max-h-none m-0 p-0 border-0 bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200"
      >
        <div class="flex flex-col h-full max-w-5xl mx-auto">
          <header class="flex items-center justify-between px-4 py-2">
            <h2 class="tracking-widest text-sm uppercase">
              {step.value === "choose" ? "Choose & order" : "Share"}
            </h2>
            <button
              type="button"
              aria-label="Close"
              class="size-11 flex items-center justify-center text-2xl"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </header>

          {step.value === "choose"
            ? (
              <>
                <ol
                  ref={list}
                  class="flex-1 overflow-y-auto px-2 text-sm"
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
                      <li
                        key={row.id}
                        class="flex items-center gap-1 odd:bg-neutral-200 odd:dark:bg-neutral-700"
                      >
                        <button
                          type="button"
                          data-handle={row.id}
                          aria-label={`Reorder ${ref.reference}`}
                          class="size-11 shrink-0 flex items-center justify-center text-neutral-500 cursor-grab touch-none"
                          onKeyDown={(e) => onHandleKey(e, i)}
                        >
                          <svg
                            viewBox="0 0 10 16"
                            width="10"
                            height="16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            {[3, 8, 13].flatMap((y) => [
                              <circle key={`l${y}`} cx="2" cy={y} r="1.5" />,
                              <circle key={`r${y}`} cx="8" cy={y} r="1.5" />,
                            ])}
                          </svg>
                        </button>
                        <label
                          class={`flex flex-1 items-center gap-3 min-h-11 pr-2 ${
                            ok ? "cursor-pointer" : "opacity-60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            class="size-5 accent-blue-600 dark:accent-blue-400"
                            checked={ok && row.on}
                            disabled={!ok}
                            onChange={() => toggle(row.id)}
                          />
                          <span class="flex-1">{ref.reference}</span>
                          {!ok && (
                            <span class="text-xs text-neutral-500">
                              Whole book
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ol>
                <footer class="p-4">
                  <button
                    type="button"
                    class={`${filled} w-full disabled:opacity-40`}
                    disabled={!checked.length}
                    onClick={() => step.value = "qr"}
                  >
                    Show QR for {plural(checked.length)}
                  </button>
                </footer>
              </>
            )
            : (
              <>
                <div class="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row items-center md:items-stretch gap-6 px-4">
                  <figure class="flex flex-col items-center justify-center shrink-0 gap-2">
                    <img
                      src={toSvgDataURL(
                        generate(
                          shareUrl(location.origin, digits, { qr: true }),
                        ),
                        { on: "black", off: "white", pad: 4 },
                      )}
                      alt="QR code for the shared list"
                      class="bg-white aspect-square w-[min(70vh,90vw)] md:w-[min(75vh,45vw)]"
                      style="image-rendering: pixelated"
                    />
                    <figcaption class="tracking-widest text-xs">
                      SCAN TO OPEN
                    </figcaption>
                  </figure>
                  <section class="flex flex-col w-full md:flex-1 md:min-h-0">
                    <h3 class="text-xl font-medium mb-2">
                      {plural(checked.length)}
                    </h3>
                    <ol class="list-decimal pl-6 space-y-1 md:overflow-y-auto md:min-h-0">
                      {checked.map((ref) => (
                        <li key={ref.id}>{ref.reference}</li>
                      ))}
                    </ol>
                  </section>
                </div>
                <footer class="flex flex-wrap items-center justify-end gap-3 p-4">
                  <button
                    type="button"
                    class="min-h-11 px-3 mr-auto text-blue-600 dark:text-blue-400"
                    onClick={() => step.value = "choose"}
                  >
                    Edit list
                  </button>
                  <button type="button" class={outlined} onClick={copy}>
                    <span aria-live="polite">
                      {copyState.value === "ok"
                        ? "Copied ✓"
                        : copyState.value === "fail"
                        ? "Copy failed"
                        : "Copy link"}
                    </span>
                  </button>
                  <button type="button" class={filled} onClick={share}>
                    Share…
                  </button>
                </footer>
              </>
            )}
        </div>
      </dialog>
    </>
  );
}
