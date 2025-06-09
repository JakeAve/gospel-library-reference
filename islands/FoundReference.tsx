import { Reference, ReferenceMatch } from "@jakeave/scripture-ref/types";
import { useToastContext } from "./Contexts/Toast.tsx";
import ScriptureReference from "../components/ScriptureReference.tsx";
import FindResult from "../components/FoundResult.tsx";
import { add } from "../lib/indexedDB.ts";

export default function ResultItem(
  { reference, refreshDB }: { reference: Reference; refreshDB: () => void },
) {
  const { showMessage } = useToastContext();

  async function addReference() {
    if (reference) {
      await add(reference);
      showMessage(
        `☑️ Added ${reference.reference.slice(0, 50)}`.trim(),
      );
    }
    refreshDB();
  }

  const refMatch = reference as ReferenceMatch;

  let element = <ScriptureReference {...reference} />;

  if (refMatch.match) {
    element = <FindResult {...refMatch} />;
  }

  return (
    <div class="flex flex-row items-center justify-between p-2 gap-4 even:bg-neutral-200 even:dark:bg-neutral-700">
      <div class="text-lg ">
        {element}
      </div>
      <button
        class="flex items-center justify-center p-2 font-bold text-blue-500 border-2 border-blue-500 ease-out duration-300 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200 hover:border-blue-700 focus:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 dark:focus:border-blue-200 rounded-md h-9 w-9 active:scale-90"
        aria-label="Save reference"
        title="Save reference"
        type="button"
        onClick={addReference}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
        </svg>
      </button>
    </div>
  );
}
