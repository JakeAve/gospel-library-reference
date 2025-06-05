import { computed, signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime/src/index.d.ts";
import { addContent } from "../lib/indexedDb.ts";
import { fetchContent } from "../lib/fetchContent.ts";

interface Props {
  api?: string;
  id?: number;
  content?: string;
}

export default function ReferenceContent(props: Props) {
  const { api, id, content } = props;

  if (!api) {
    return <p>Cannot pull content</p>;
  }

  if (!IS_BROWSER) {
    return <p>Cannot pull content outside of browser</p>;
  }

  const contentSignal = signal<string>(content || "");
  const errorSignal = signal<string>("");
  const displayedMessage = computed(() =>
    errorSignal.value || contentSignal.value || ""
  );

  async function toggleDetails(
    e: JSX.TargetedEvent<HTMLDetailsElement, ToggleEvent>,
  ) {
    if (e.newState === "open" && !contentSignal.value && api) {
      contentSignal.value = "loading...";

      try {
        const result = await fetchContent(api);
        contentSignal.value = result;
        if (id) await addContent(id, result);
      } catch (e) {
        const err = e as Error;
        errorSignal.value = err.message;
      }
    }
  }

  return (
    <details
      class="relative w-full col-span-2"
      onToggle={toggleDetails}
    >
      <summary class="px-1 cursor-pointer select-none marker:text-blue-500 marker:hover:text-blue-700 marker:focus:text-blue-700 dark:marker:text-blue-400 dark:marker:hover:text-blue-200 dark:marker:focus:text-blue-200">
        &nbsp;&nbsp;Read
      </summary>
      <div class="px-2 pt-2 pb-4 overflow-y-auto max-h-24 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        <p class="w-full">{content || displayedMessage}</p>
      </div>
      <div class="absolute bottom-0 right-2 z-10 w-full h-4 pointer-events-none  bg-white/0 backdrop-blur-sm">
      </div>
    </details>
  );
}
