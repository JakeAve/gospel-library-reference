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
      <div class="sticky top-0 bg-neutral-500/10 backdrop-blur-3xl">
        <AddForm
          onSubmit={addReference}
          referenceSignal={reference}
          inputSignal={input}
        />
      </div>
      <div class="mx-auto max-w-lg flex flex-col gap-2 text-sm mt-4 px-4">
        <h2 class="tracking-widest px-2">History</h2>
        {storedRefs}
      </div>
    </div>
  );
}
