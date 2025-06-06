import { computed, Signal } from "@preact/signals";
import ScriptureReference from "../components/ScriptureReference.tsx";
import type { Reference } from "@jakeave/scripture-ref/types";

interface Props {
  onSubmit: (e: SubmitEvent) => void;
  referenceSignal: Signal<Reference | "">;
  inputSignal: Signal<string>;
}

export default function AddForm(props: Props) {
  const { onSubmit, referenceSignal, inputSignal } = props;

  function updateInput(e: InputEvent) {
    const inputField = e.target as HTMLInputElement;
    const text = inputField.value;
    inputSignal.value = text;
  }

  function resetForm() {
    inputSignal.value = "";
  }

  const linkElement = computed(() => {
    const ref = referenceSignal.value;
    if (!ref) return;
    return (
      <div class="text-lg ">
        <ScriptureReference {...ref} />
      </div>
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

  return (
    <div class="flex flex-col max-w-lg px-8 py-8 mx-auto gap-8">
      <form
        class="grid gap-2"
        autoComplete="off"
        onSubmit={onSubmit}
        onReset={resetForm}
      >
        <label class="text-xl font-light" for="reference">
          Type scripture reference
        </label>
        <div class="relative flex gap-2">
          <input
            class="flex-auto py-1 text-xl font-light bg-transparent border-b-2 rounded-none outline-none ps-6 pe-1 border-neutral-400 dark:focus:border-neutral-200 focus:border-black"
            name="reference"
            id="reference"
            autoFocus
            onInput={updateInput}
          />
          {cancelButton}
          <button
            class="flex items-center justify-center p-2 font-bold text-blue-500 border-2 border-blue-500 ease-out duration-300 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200 hover:border-blue-700 focus:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 dark:focus:border-blue-200 rounded-md h-9 w-9 active:scale-90"
            aria-label="Save reference"
            title="Save reference"
            type="submit"
          >
            +
          </button>
        </div>
      </form>
      {linkElement}
    </div>
  );
}
