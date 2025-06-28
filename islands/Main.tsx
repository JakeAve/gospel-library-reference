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
    if (!dbList.value.length) {
      return (
        <div class="flex justify-center items-center gap-1 italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="currentColor"
            class="inline"
          >
            <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
          </svg>
          Save references to see them here{" "}
        </div>
      );
    }
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
