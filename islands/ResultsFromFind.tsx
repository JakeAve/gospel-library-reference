import { useEffect, useRef } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { ReferenceMatch } from "@jakeave/scripture-ref/types";
import ResultItem from "./FoundReference.tsx";
import { findReference } from "../lib/findReference.ts";

interface Props {
  resultsSignal: Signal<ReferenceMatch[]>;
  refreshDB: () => void;
  inputSignal: Signal<string>;
  filtersSignal: Signal<{ volumes: string[]; books: string[] }>;
}

export default function ResultsFromFind(props: Props) {
  const { resultsSignal, refreshDB, inputSignal, filtersSignal } = props;
  const isIncomplete = useSignal(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !isIncomplete.value) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && isIncomplete.value) {
        updateResults();
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [isIncomplete.value]);

  async function updateResults() {
    const resultsPeek = resultsSignal.peek();
    const results = await findReference(inputSignal.value, {
      start: resultsPeek.length,
      end: resultsPeek.length + 5,
      books: filtersSignal.value.books,
      volumes: filtersSignal.value.volumes,
    });

    if (!results.length) {
      isIncomplete.value = false;
    }

    resultsSignal.value = [...resultsPeek, ...results];
  }

  return (
    <div class="flex flex-col gap-4">
      {resultsSignal.value.map((r, i) => (
        <ResultItem key={i} reference={r} refreshDB={refreshDB} />
      ))}
      <div ref={sentinelRef} style={{ height: "1px" }}></div>
      {isIncomplete.value
        ? (
          <div class="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="currentColor"
              class="animate-spin"
              aria-label="loading content"
            >
              <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
            </svg>
          </div>
        )
        : <p class="text-center">End of results</p>}
    </div>
  );
}
