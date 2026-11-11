import { useSignal } from "@preact/signals";
import type { Reference } from "@jakeave/scripture-ref/types";
import { add, getAll } from "../lib/indexedDB.ts";
import { refreshSaved, rememberShared } from "./state.ts";

const plural = (n: number) => `${n} reference${n === 1 ? "" : "s"}`;

export default function SaveAllBtn({ refs }: { refs: Reference[] }) {
  const result = useSignal<{ saved: number; existing: number } | null>(null);
  const busy = useSignal(false);
  const error = useSignal(false);

  async function saveAll() {
    if (busy.value) return;
    busy.value = true;
    error.value = false;
    try {
      const have = new Set((await getAll()).map((r) => r.reference));
      let saved = 0;
      for (const ref of refs) {
        if (have.has(ref.reference)) continue;
        have.add(ref.reference);
        await add(ref); // sequential, so rows land in list order
        saved++;
      }
      // A readonly read queues behind the writes above, so they're committed
      // before we say "Saved".
      await refreshSaved();
      rememberShared(null); // it's all in the saved list now
      result.value = { saved, existing: refs.length - saved };
    } catch {
      // Retrying is safe: dedup re-reads getAll(), so a partial save is fine.
      error.value = true;
    } finally {
      busy.value = false;
    }
  }

  if (result.value) {
    const { saved, existing } = result.value;
    return (
      <div class="stack">
        <div class="btn-subtle tint wide" role="status">
          {saved ? `Saved ${plural(saved)}` : "Already saved"}
          {saved > 0 && existing > 0 && ` · ${existing} already there`}
        </div>
        <a href="/" class="note">Open my list</a>
      </div>
    );
  }

  return (
    <div class="stack">
      <button type="button" class="btn-primary wide" onClick={saveAll}>
        Save all
      </button>
      {error.value && <p class="note">Couldn't save. Try again</p>}
    </div>
  );
}
