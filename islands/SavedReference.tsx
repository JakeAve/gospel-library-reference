import { useRef } from "preact/hooks";
import ScriptureReference from "../components/ScriptureReference.tsx";
import { deleteById, RefWithId } from "../lib/indexedDB.ts";

export interface RefItemProps extends RefWithId {
  deleteCallback: () => void;
}

export default function (props: RefItemProps) {
  const { id, deleteCallback, reference } = props;

  async function deleteItem() {
    const shouldDelete = confirm(
      `Are you sure you want to delete this link to ${reference}?`,
    );

    if (shouldDelete) {
      await deleteById(id);
      deleteCallback();
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      class="flex items-center justify-between px-2 py-3 bounce-in odd:bg-neutral-200 odd:dark:bg-neutral-700 gap-4"
    >
      <ScriptureReference {...props} />
      <button
        type="button"
        aria-label="delete"
        class="text-red-500 hover:text-red-700 focus:text-red-700 dark:text-red-400 dark:hover:text-red-200 dark:focus:text-red-200"
        onClick={deleteItem}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="currentColor"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
    </div>
  );
}
