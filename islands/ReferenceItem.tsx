import { useRef } from "preact/hooks";
import ScriptureReference from "../components/ScriptureReference.tsx";
import { deleteById, RefWithId } from "../lib/indexedDB.ts";

export interface RefItemProps extends RefWithId {
  deleteCallback: () => void;
}

export default function (props: RefItemProps) {
  const { id, deleteCallback } = props;

  async function deleteItem() {
    const shouldDelete = confirm(
      `Are you sure you want to delete this link to ${props.book.name}${
        props.chapter ? " " + props.chapter : ""
      }?`,
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
      class="flex items-center justify-between px-2 py-3 bounce-in odd:bg-neutral-200 odd:dark:bg-neutral-700 gap-2"
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
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
    </div>
  );
}
