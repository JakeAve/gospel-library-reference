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
    <form>
      <label for="reference">Type scripture reference</label>
      <input name="reference" id="reference" onInput={format} />
      <div>{suggestions}</div>
    </form>
  );
}
