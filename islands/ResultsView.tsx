import type { ReferenceMatch } from "@jakeave/scripture-ref/types";
import { findMatchIdxs } from "../lib/findMatchIdxs.ts";
import { filterLabel } from "../lib/books.ts";
import {
  filters,
  go,
  hasMore,
  more,
  query,
  results,
  search,
  status,
} from "./state.ts";
import { Icon } from "./Icons.tsx";

function Snippet({ content, match }: ReferenceMatch) {
  const text = content as string;
  const idx = findMatchIdxs({ content: text, match });
  if (!idx || idx[0] < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx[0])}
      <mark>{text.slice(idx[0], idx[1])}</mark>
      {text.slice(idx[1])}
    </>
  );
}

const Skeleton = () => (
  <div class="skel" aria-hidden="true">
    <span />
    <span />
  </div>
);

export default function ResultsView() {
  const list = results.value;
  const n = list.length;
  const s = status.value;
  const label = filterLabel(filters.value);
  const filtered = label !== "All books";

  return (
    <>
      <div class="sheet-head split">
        <h2 aria-live="polite">
          {s === "loading"
            ? "Searching"
            : `${n}${hasMore.value ? "+" : ""} match${n === 1 ? "" : "es"}`}
        </h2>
        <button
          type="button"
          class={filtered ? "btn-subtle tint" : "btn-subtle"}
          onClick={() => go({ kind: "filter" })}
        >
          {label}
          <Icon name="chevron-down" />
        </button>
      </div>
      <div class="sheet-body">
        {s === "loading" && [1, 2, 3].map((i) => <Skeleton key={i} />)}
        <ul>
          {list.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                class="result"
                onClick={() => go({ kind: "ref", r, back: true })}
              >
                <span class="result-title">{r.reference}</span>
                <span class="snippet">
                  <Snippet {...r} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        {s === "more" && <Skeleton />}
        {s === "error" && (
          <div class="center">
            <p class="note">Couldn't reach the search. Check your connection</p>
            <button type="button" class="btn-subtle tint" onClick={search}>
              Try again
            </button>
          </div>
        )}
        {s === "idle" && !n && (
          <div class="center">
            <p class="note">
              No matches for “{query.value.trim()}”
              {filtered ? ` in ${label}` : ". Try fewer or different words"}
            </p>
            {filtered && (
              <button
                type="button"
                class="btn-subtle tint"
                onClick={() => {
                  filters.value = { volumes: [], books: [] };
                  search();
                }}
              >
                Search all books
              </button>
            )}
          </div>
        )}
        {s === "idle" && hasMore.value && (
          <button type="button" class="btn-subtle wide" onClick={more}>
            Show more
          </button>
        )}
      </div>
    </>
  );
}
