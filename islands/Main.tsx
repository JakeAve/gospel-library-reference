import { signal, useComputed } from "@preact/signals";
import { getAll, RefWithId } from "../lib/indexedDB.ts";
import ReferenceItem from "./SavedReference.tsx";
import AddForm from "./AddForm.tsx";

const dbList = signal<RefWithId[]>([]);

export default function Form() {
  if (!dbList.peek().length) {
    getAll().then((rs) => {
      dbList.value = rs;
    });
  }

  const storedRefs = useComputed(() => {
    return dbList.value.map((r) => (
      <ReferenceItem key={r.id} deleteCallback={deleteCallback} {...r} />
    ));
  });

  async function refreshDB() {
    dbList.value = await getAll();
  }

  async function deleteCallback() {
    dbList.value = await getAll();
  }

  return (
    <div class="relative">
      <div class="sticky z-20 top-0 bg-neutral-50 dark:bg-neutral-800 shadow-[0px_40px_80px_rgba(0,0,0,0.1)] dark:shadow-[0px_40px_80px_rgba(255,255,255,0.05)]">
        <AddForm
          refreshDB={refreshDB}
        />
      </div>
      <div class="flex flex-col max-w-lg px-4 pb-8 mx-auto mt-4 text-sm gap-2">
        <h2 class="px-2 tracking-widest">Saved</h2>
        {storedRefs}
      </div>
    </div>
  );
}
