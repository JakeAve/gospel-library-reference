import { computed, signal } from "@preact/signals";
import type { Reference } from "@jakeave/scripture-ref/types";
import { parseRef } from "@jakeave/scripture-ref/client";
import { findReference } from "../lib/findReference.ts";
import { determineTextType } from "../lib/determineTextType.ts";
import ResultItem from "./FoundReference.tsx";
import { useToastContext } from "./Contexts/Toast.tsx";
import ToggleHeight, {
  COLLAPSED_HEIGHT,
  EXPANDED_HEIGHT,
} from "./ToggleHeight.tsx";
import { useRef } from "preact/hooks";

interface Props {
  refreshDB: () => void;
}

const inputSignal = signal("");
const heightSignal = signal(COLLAPSED_HEIGHT);
const resultsSignal = signal<Reference[]>([]);
const isLoadingSearchResults = signal(false);

export default function AddForm(props: Props) {
  const { refreshDB } = props;

  // hooks
  const inputRef = useRef<HTMLInputElement>(null);
  const { showMessage } = useToastContext();

  // state
  const isSearchDisabled = computed(() => inputSignal.value.length < 5);

  // conditional elements
  const referenceElement = computed(() => {
    const val = inputSignal.value;
    if (val.trim() === "") {
      return;
    }
    if (determineTextType(inputSignal.value) === "query") {
      return;
    }
    if (loadingElement.value) {
      return;
    }
    if (resultsSignal.value.length) {
      return;
    }

    return <ResultItem reference={parseRef(val)} refreshDB={refreshDB} />;
  });

  const loadingElement = computed(() => {
    if (isLoadingSearchResults.value) {
      return (
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
      );
    }
  });

  const resultsElement = computed(() => {
    if (!resultsSignal.value.length) return;
    return (
      <>
        <div class="flex flex-col gap-4">
          {resultsSignal.value.map((r, i) => (
            <ResultItem key={i} reference={r} refreshDB={refreshDB} />
          ))}
        </div>
      </>
    );
  });

  const cancelButton = computed(() => {
    if (!inputSignal.value) return;
    return (
      <button
        class={`absolute left-0 top-3 text-neutral-400`}
        type="reset"
        aria-label="reset"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
          fill="currentColor"
        >
          <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
      </button>
    );
  });

  // event handlers
  function toggleHeight() {
    heightSignal.value = heightSignal.value === EXPANDED_HEIGHT
      ? COLLAPSED_HEIGHT
      : EXPANDED_HEIGHT;
  }

  function updateInput(e: InputEvent) {
    const inputField = e.target as HTMLInputElement;
    const text = inputField.value;
    inputSignal.value = text;
    resultsSignal.value = [];
    if (text.trim()) {
      heightSignal.value = EXPANDED_HEIGHT;
    } else {
      heightSignal.value = COLLAPSED_HEIGHT;
    }
  }

  async function search(e: SubmitEvent) {
    try {
      e.preventDefault();
      isLoadingSearchResults.value = true;
      heightSignal.value = EXPANDED_HEIGHT;
      const results = await findReference(inputSignal.value);
      if (!results.length) {
        showMessage(`No results found for ${inputSignal.value}`);
      }
      resultsSignal.value = results;
    } catch {
      // TODO: will look at this
    }
    isLoadingSearchResults.value = false;
  }

  function reset() {
    inputSignal.value = "";
    resultsSignal.value = [];
    heightSignal.value = COLLAPSED_HEIGHT;
    inputRef.current?.focus();
  }

  return (
    <div class="relative flex flex-col max-w-lg px-8 py-8 mx-auto gap-8">
      <form
        class="grid gap-2"
        autoComplete="off"
        onSubmit={search}
        onReset={reset}
        disabled={isSearchDisabled}
      >
        <label class="text-xl font-light" for="reference">
          Find a scripture
        </label>
        <div class="relative flex gap-2">
          <input
            class="flex-auto py-1 text-xl font-light bg-transparent border-b-2 rounded-none outline-none ps-6 pe-1 border-neutral-400 dark:focus:border-neutral-200 focus:border-black"
            name="reference"
            id="reference"
            autoFocus
            onInput={updateInput}
            ref={inputRef}
          />
          {cancelButton}
          <button
            class="flex items-center justify-center p-2 font-bold text-blue-500 border-2 border-blue-500 rounded-full disabled:text-neutral-300 disabled:border-neutral-300 dark:disabled:text-neutral-700 dark:disabled:border-neutral-700 ease-out duration-300 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200 hover:border-blue-700 focus:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 dark:focus:border-blue-200 h-9 w-9 active:scale-90"
            aria-label="Search"
            title="Search"
            type="submit"
            disabled={isSearchDisabled}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </div>
      </form>
      <div
        class={`${heightSignal.value} relative overflow-y-auto px-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full`}
      >
        {loadingElement}
        {referenceElement}
        {resultsElement}
      </div>
      <div class="absolute z-20 w-full h-12 pointer-events-none bottom-2 right-10 bg-white/0 backdrop-blur-sm">
      </div>
      <ToggleHeight
        heightSignal={heightSignal}
        inputSignal={inputSignal}
        referenceSignal={referenceElement}
        resultsSignal={resultsSignal}
        toggleHeight={toggleHeight}
      />
    </div>
  );
}
