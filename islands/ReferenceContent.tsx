import { computed, signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime/src/index.d.ts";
import { addContent } from "../lib/indexedDB.ts";
import { fetchContent } from "../lib/fetchContent.ts";
import { CopyBtn } from "./CopyBtn.tsx";

interface Props {
  api?: string;
  id?: number;
  content?: string;
}

const isLoading = signal(false);
const errorSignal = signal("");

export default function ReferenceContent(props: Props) {
  const { api, id, content } = props;

  if (!api) {
    return <p>Cannot pull content</p>;
  }

  if (!IS_BROWSER) {
    return <p>Cannot pull content outside of browser</p>;
  }

  const contentSignal = signal(content || "");

  const displayedMessage = computed(() => {
    if (errorSignal.value) return errorSignal.value;
    return isLoading.value
      ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          class="animate-spin"
          aria-label="loading content"
        >
          <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
        </svg>
      )
      : contentSignal.value
      ? (
        <>
          <CopyBtn content={contentSignal.value} />&nbsp;
          {contentSignal.value}
        </>
      )
      : "";
  });

  async function toggleDetails(
    e: JSX.TargetedEvent<HTMLDetailsElement, ToggleEvent>,
  ) {
    if (e.newState === "open" && !contentSignal.value && api) {
      isLoading.value = true;

      try {
        const result = await fetchContent(api);
        contentSignal.value = result;
        if (id) await addContent(id, result);
      } catch (e) {
        const err = e as Error;
        errorSignal.value = err.message;
      } finally {
        isLoading.value = false;
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
        <p class="w-full">{displayedMessage}</p>
      </div>
      <div class="absolute bottom-0 z-10 w-full h-4 pointer-events-none right-2  bg-white/0 backdrop-blur-sm">
      </div>
    </details>
  );
}
