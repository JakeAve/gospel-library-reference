import { computed, signal } from "@preact/signals";
import { parseReference } from "../lib/parseReference.ts";
import ScriptureReference from "../components/ScriptureReference.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { add, getAll, RefWithId } from "../lib/indexedDb.ts";
import ReferenceItem from "./ReferenceItem.tsx";

const input = signal("");

const dbList = signal<RefWithId[]>([]);

export default function Form() {
  if (!IS_BROWSER) {
    return <></>;
  }

  if (!dbList.peek().length) {
    getAll().then((rs) => {
      dbList.value = rs;
    });
  }

  function format(e: InputEvent) {
    const inputField = e.target as HTMLInputElement;
    const text = inputField.value;
    input.value = text;
  }

  const reference = computed(() => {
    const val = input.value;
    if (val.trim() === "") return "";
    return parseReference(val);
  });

  const linkElement = computed(() => {
    const ref = reference.value;
    if (!ref) return <></>;
    return (
      <div class="text-lg">
        <ScriptureReference {...ref} />
      </div>
    );
  });

  const storedRefs = computed(() => {
    return dbList.value.map((r) => (
      <ReferenceItem key={r.id} deleteCallback={deleteCallback} {...r} />
    ));
  });

  async function addReference(e: SubmitEvent) {
    e.preventDefault();
    const ref = reference.value;
    if (ref) {
      await add(ref);
    }

    dbList.value = await getAll();
  }

  async function deleteCallback() {
    dbList.value = await getAll();
  }

  return (
    <div class="mx-auto max-w-lg flex flex-col gap-8">
      <form class="grid gap-2" autoComplete="off" onSubmit={addReference}>
        <label class="text-xl font-light" for="reference">
          Type scripture reference
        </label>
        <div class="flex gap-2">
          <input
            class="text-xl flex-auto font-light border-b-2 px-1 py-1 bg-transparent dark:border-neutral-400 dark:focus:border-neutral-200 focus:border-black outline-none"
            name="reference"
            id="reference"
            autoFocus
            onInput={format}
          />
          <button
            class="font-bold text-blue-500 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200 p-2 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 dark:focus:border-blue-200 rounded-md h-9 w-9 flex justify-center items-center active:scale-90"
            aria-label="Add reference"
            title="Add reference"
            type="submit"
          >
            +
          </button>
        </div>
      </form>
      {linkElement}
      <div
        class={`${
          reference.value ? "border-t pt-8" : ""
        } flex flex-col gap-2 text-sm`}
      >
        <h2 class="tracking-widest px-2">History</h2>
        {storedRefs}
      </div>
    </div>
  );
}
