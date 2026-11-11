import { signal } from "@preact/signals";

type Action = [label: string, run: () => void];

const toast = signal<{ msg: string; action?: Action } | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

/** Past tense, says what happened: "Saved", `Copied link "Jn 3:16"`. */
export function showMessage(msg: string, action?: Action) {
  clearTimeout(timer);
  toast.value = { msg, action };
  timer = setTimeout(() => toast.value = null, action ? 5000 : 1400);
}

export default function Toast() {
  const t = toast.value;
  // Always rendered so role="status" announces when its text changes.
  return (
    <div class="toast" role="status">
      {t && t.msg}
      {t?.action && (
        <button
          type="button"
          onClick={() => {
            t.action![1]();
            toast.value = null;
          }}
        >
          {t.action[0]}
        </button>
      )}
    </div>
  );
}
