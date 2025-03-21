import { computed, Signal } from "@preact/signals";

import { parseReference } from "../lib/parseReference.ts";
import ScriptureReference from "../components/ScriptureReference.tsx";

const input = new Signal("");

export default function Form() {
  function format(e: InputEvent) {
    const inputField = e.target as HTMLInputElement;
    const text = inputField.value;
    input.value = text;
  }

  const suggestions = computed(() => {
    const val = input.value;

    if (val.trim() === "") return <></>;

    const reference = parseReference(val);
    return <ScriptureReference {...reference} />;
  });

  return (
    <form class="grid gap-2" autoComplete="off">
      <label class="text-xl font-light" for="reference">Type scripture reference</label>
      <input
        class="text-xl font-light border-b-2 px-1 py-1 bg-transparent dark:border-neutral-400 dark:focus:border-neutral-200 focus:border-black outline-none w-72"
        name="reference"
        id="reference"
        autoFocus
        onInput={format}
      />
      <div>{suggestions}</div>
    </form>
  );
}
