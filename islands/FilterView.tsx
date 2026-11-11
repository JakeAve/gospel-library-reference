import { useState } from "preact/hooks";
import {
  isBookOn,
  toggleBook,
  toggleVolume,
  VOLUMES,
  volumeState,
} from "../lib/books.ts";
import { backToResults, filters } from "./state.ts";
import { Icon } from "./Icons.tsx";
import { BackBtn, Head } from "./Sheet.tsx";

export function Check(
  { checked, label, onClick }: {
    checked: boolean | "mixed";
    label: string;
    onClick: () => void;
  },
) {
  return (
    <button
      type="button"
      role="checkbox"
      class="check"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {checked === "mixed"
        ? <Icon name="minus" />
        : checked && <Icon name="check" />}
    </button>
  );
}

export default function FilterView() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string[]>([]);
  const f = filters.value;
  const needle = q.trim().toLowerCase();

  return (
    <>
      <Head
        back={<BackBtn label="Results" onClick={backToResults} />}
        title="Books"
      />
      <div class="sheet-body">
        <input
          class="field"
          type="text"
          placeholder="Find a book"
          aria-label="Find a book"
          value={q}
          onInput={(e) => setQ(e.currentTarget.value)}
        />
        <ul>
          {VOLUMES.map((v) => {
            const books = needle
              ? v.books.filter((b) => b.toLowerCase().includes(needle))
              : v.books;
            if (!books.length) return null;
            const st = volumeState(f, v.id);
            const single = v.books.length === 1;
            const expanded = !single && (!!needle || open.includes(v.id));
            const toggle = () => filters.value = toggleVolume(f, v.id);
            return (
              <li key={v.id}>
                <div class="vol">
                  <Check checked={st.checked} label={v.name} onClick={toggle} />
                  <button
                    type="button"
                    class="vol-name"
                    aria-expanded={single ? undefined : expanded}
                    onClick={single ? toggle : () =>
                      setOpen(
                        open.includes(v.id)
                          ? open.filter((x) => x !== v.id)
                          : [...open, v.id],
                      )}
                  >
                    <span>{v.name}</span>
                    {st.checked === "mixed" && (
                      <span class="count">
                        {st.count} of {v.books.length}
                      </span>
                    )}
                    {!single && <Icon name="chevron-down" />}
                  </button>
                </div>
                {expanded && (
                  <div class="chips">
                    {books.map((b) => (
                      <button
                        key={b}
                        type="button"
                        class="chip"
                        aria-pressed={isBookOn(f, v.id, b)}
                        onClick={() => filters.value = toggleBook(f, v.id, b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div class="sheet-foot">
        <button
          type="button"
          class="btn-subtle"
          onClick={() => filters.value = { volumes: [], books: [] }}
        >
          Clear
        </button>
        <button type="button" class="btn-primary" onClick={backToResults}>
          Show matches
        </button>
      </div>
    </>
  );
}
