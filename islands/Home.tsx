import { useEffect, useRef } from "preact/hooks";
import type { Reference } from "@jakeave/scripture-ref/types";
import Header from "../components/Header.tsx";
import {
  asRef,
  go,
  lastShared,
  liveRef,
  query,
  refreshSaved,
  rememberShared,
  saved,
  submit,
  syncUrl,
} from "./state.ts";
import { Icon, IconBtn } from "./Icons.tsx";
import Sheet from "./Sheet.tsx";
import { openShare } from "./ShareView.tsx";
import { decodeShared } from "../lib/shareList.ts";

/** A saved or shared reference; the whole row opens the reference sheet. */
export function RefRow({ r }: { r: Reference }) {
  return (
    <button
      type="button"
      class="row"
      onClick={() => go({ kind: "ref", r })}
    >
      <span class="row-main">
        <span class="row-title">{r.reference}</span>
        {r.content && <span class="row-preview">{r.content}</span>}
      </span>
      <Icon name="chevron-right" />
    </button>
  );
}

/** Link back to the last shared list, for tabs that can't go Back to it. */
function SharedReturn() {
  const digits = lastShared.value;
  const n = digits ? decodeShared(digits).length : 0;
  if (!n) return null;
  return (
    <div class="row shared-return">
      <a class="row-main" href={`/s/${digits}`}>
        <span class="row-title">Shared with you</span>
        <span class="sub">{n} {n === 1 ? "reference" : "references"}</span>
      </a>
      <IconBtn
        icon="x"
        label="Dismiss"
        neutral
        onClick={() => rememberShared(null)}
      />
    </div>
  );
}

function SearchBar() {
  const input = useRef<HTMLInputElement>(null);
  return (
    <form
      class="searchbar glass"
      role="search"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {query.value
        ? (
          <IconBtn
            icon="x"
            label="Clear"
            neutral
            onClick={() => {
              query.value = "";
              input.current?.focus();
            }}
          />
        )
        : (
          <span class="lead">
            <Icon name="search" />
          </span>
        )}
      <input
        ref={input}
        type="text"
        enterKeyHint="search"
        autoFocus
        aria-label="Reference or words"
        placeholder="Reference or words"
        value={query.value}
        onInput={(e) => query.value = e.currentTarget.value}
      />
    </form>
  );
}

export default function Home() {
  useEffect(() => {
    refreshSaved();
    // ?find= round-trips on reload: liveRef reopens a reference, a quote searches.
    const q = query.peek().trim();
    if (q && !asRef(q)) submit();
    const stopLive = liveRef();
    const stopUrl = syncUrl();
    return () => (stopLive(), stopUrl());
  }, []);

  const list = saved.value;
  return (
    <>
      <div class="page">
        <Header />
        <main>
          <SharedReturn />
          <div class="section-head">
            <h2>Saved · {list.length}</h2>
            {list.length > 0 && (
              <button type="button" class="btn-subtle" onClick={openShare}>
                <Icon name="share" />
                Share
              </button>
            )}
          </div>
          {list.length
            ? (
              <ul class="rows">
                {list.map((r) => (
                  <li key={r.id}>
                    <RefRow r={r} />
                  </li>
                ))}
              </ul>
            )
            : (
              <p class="empty">
                Find a reference below, then save it to keep it here
              </p>
            )}
        </main>
      </div>
      <Sheet />
      <SearchBar />
    </>
  );
}
