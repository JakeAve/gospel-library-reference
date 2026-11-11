import { useEffect, useState } from "preact/hooks";
import type { Reference } from "@jakeave/scripture-ref/types";
import { add, addContent, deleteById } from "../lib/indexedDB.ts";
import { fetchContent } from "../lib/fetchContent.ts";
import { type Clip, linkClip, writeClip } from "../lib/clipboard.ts";
import { findSaved, go, refreshSaved } from "./state.ts";
import { Icon, IconBtn } from "./Icons.tsx";
import { showMessage } from "./Toast.tsx";
import { BackBtn } from "./Sheet.tsx";

function copy(clip: Clip, msg: string) {
  writeClip(clip).then(
    () => showMessage(msg),
    () => showMessage("Couldn't copy"),
  );
}

function Tile(
  { label, clip, msg, kind, wide }: {
    label: string;
    clip: Clip;
    msg: string;
    kind?: "link" | "url";
    wide?: boolean;
  },
) {
  return (
    <button
      type="button"
      class={["tile", kind === "url" ? "link url" : kind, wide && "wide"]
        .filter(Boolean).join(" ")}
      aria-label={`Copy ${kind ? "link" : "text"} ${label}`}
      title={`Copy ${kind ? "link" : "text"}`}
      onClick={() => copy(clip, msg)}
    >
      <span class="label">{label}</span>
      <Icon name="copy" />
    </button>
  );
}

export default function RefView({ r, back }: { r: Reference; back?: boolean }) {
  const [verse, setVerse] = useState(r.content ?? "");
  const [error, setError] = useState("");
  const loading = !verse && !error && !!r.api;
  const mine = findSaved(r);

  useEffect(() => {
    if (r.content || !r.api) return;
    fetchContent(r.api).then(
      (text) => {
        setVerse(text);
        const s = findSaved(r);
        if (s) addContent(s.id, text).then(refreshSaved, () => {});
      },
      (e) => setError((e as Error).message),
    );
  }, [r]);

  async function toggleSave() {
    if (mine) {
      await deleteById(mine.id);
      await refreshSaved();
      showMessage("Removed from saved", [
        "Undo",
        () => add(mine).then(refreshSaved),
      ]);
    } else {
      await add(verse ? { ...r, content: verse } : r);
      await refreshSaved();
      showMessage("Saved");
    }
  }

  const hasAbbr = r.book.name !== r.book.abbr;

  return (
    <>
      {back && (
        <div class="sheet-head">
          <BackBtn
            label="Results"
            onClick={() => go({ kind: "results" }, "back")}
          />
        </div>
      )}
      <div class="sheet-body">
        <div class="ref-head">
          <h2 class="ref-title">
            {r.reference}
            {verse && (
              <IconBtn
                icon="copy"
                label="Copy verse and link"
                onClick={() =>
                  copy(
                    linkClip(r.reference, r.link, verse),
                    "Copied verse and link",
                  )}
              />
            )}
          </h2>
          <div class="ref-actions">
            <IconBtn
              icon={mine ? "bookmark-minus" : "bookmark-plus"}
              label={mine ? "Remove from saved" : "Save"}
              onClick={toggleSave}
            />
            <a
              class="btn-icon"
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in Gospel Library"
              title="Open in Gospel Library"
            >
              <Icon name="external" />
            </a>
          </div>
        </div>

        {loading && (
          <div class="skel" aria-label="Loading verse">
            <span />
            <span />
          </div>
        )}
        {error && <p class="verse note">{error}</p>}
        {verse && (
          <p class="verse">
            <IconBtn
              icon="copy"
              label="Copy verse"
              onClick={() => copy({ plain: verse }, "Copied verse")}
            />
            {verse}
          </p>
        )}

        <div class="tiles">
          <Tile
            kind="link"
            wide={!hasAbbr}
            label={r.reference}
            clip={linkClip(r.reference, r.link)}
            msg={`Copied link "${r.reference}"`}
          />
          {hasAbbr && (
            <Tile
              kind="link"
              label={r.abbr}
              clip={linkClip(r.abbr, r.link)}
              msg={`Copied link "${r.abbr}"`}
            />
          )}
          <Tile
            kind="url"
            wide
            label={r.link}
            clip={{ plain: r.link }}
            msg="Copied URL"
          />
        </div>
        <div class="tiles">
          <Tile
            wide={!hasAbbr}
            label={r.reference}
            clip={{ plain: r.reference }}
            msg={`Copied text "${r.reference}"`}
          />
          {hasAbbr && (
            <Tile
              label={r.abbr}
              clip={{ plain: r.abbr }}
              msg={`Copied text "${r.abbr}"`}
            />
          )}
        </div>
      </div>
    </>
  );
}
