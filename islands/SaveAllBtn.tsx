import { useSignal } from "@preact/signals";
import type { Reference } from "@jakeave/scripture-ref/types";
import { add, getAll } from "../lib/indexedDB.ts";

export default function SaveAllBtn({ refs }: { refs: Reference[] }) {
  const result = useSignal<{ saved: number; existing: number } | null>(null);
  const busy = useSignal(false);
  const error = useSignal(false);

  async function saveAll() {
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
      await getAll();
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
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span>
          Saved {saved}
          {existing > 0 && ` · ${existing} already there`}
        </span>
        <a
          href="/"
          class="flex items-center min-h-[44px] px-2 underline text-blue-600 dark:text-blue-400"
        >
          Open my list
        </a>
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-1">
      <button
        type="button"
        disabled={busy.value}
        onClick={saveAll}
        class="w-full min-h-[44px] px-4 font-bold rounded-full bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 ease-out duration-300 disabled:opacity-60"
      >
        Save all to my list
      </button>
      {error.value && (
        <span class="text-sm text-red-600 dark:text-red-400">
          Couldn't save. Try again.
        </span>
      )}
    </div>
  );
}
