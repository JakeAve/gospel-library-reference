import { computed, signal } from "@preact/signals";
import { add, getAll, RefWithId } from "../lib/indexedDB.ts";
import ReferenceItem from "./ReferenceItem.tsx";
import AddForm from "./AddForm.tsx";
import { useToastContext } from "./Contexts/Toast.tsx";
import { parseRef } from "@jakeave/scripture-ref/client";

const input = signal("");

const dbList = signal<RefWithId[]>([]);

export default function Form() {
  const { showMessage } = useToastContext();

  if (!dbList.peek().length) {
    getAll().then((rs) => {
      dbList.value = rs;
    });
  }

  const reference = computed(() => {
    const val = input.value;
    if (val.trim() === "") return "";
    return parseRef(val);
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
      showMessage(`☑️ Added ${ref.book.name} ${ref.chapter || ""}`.trim());
    }

    dbList.value = await getAll();
  }

  async function deleteCallback() {
    dbList.value = await getAll();
  }

  return (
    <div class="relative">
      <div class="sticky z-10 top-0 bg-neutral-50 dark:bg-neutral-800 shadow-[0px_40px_80px_rgba(0,0,0,0.1)]">
        <AddForm
          onSubmit={addReference}
          referenceSignal={reference}
          inputSignal={input}
        />
      </div>
      <div class="flex flex-col max-w-lg px-4 pb-8 mx-auto mt-4 text-sm gap-2">
        <h2 class="px-2 tracking-widest">Saved</h2>
        {storedRefs}
      </div>
    </div>
  );
}
