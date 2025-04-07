import { useToastContext } from "./Contexts/Toast.tsx";

interface Props {
  link: string;
  text?: string;
}

export function CopyBtn(props: Props) {
  const { link, text } = props;

  const { showMessage } = useToastContext();

  function copy() {
    const items: Record<string, Blob> = {
      "text/plain": new Blob([link], { type: "text/plain" }),
    };

    if (text) {
      const aTag = document.createElement("a");
      aTag.innerText = text;
      aTag.href = link;

      items["text/html"] = new Blob([aTag.outerHTML], {
        type: "text/html",
      });
    }

    const clipboardItem = new ClipboardItem(items);

    navigator.clipboard.write([clipboardItem])
      .then(() => {
        showMessage("Copied link (Double click for text only)", 1500);
      }).catch(() => showMessage("Error copying 😔", 1500));
  }

  function copyText() {
    if (text) {
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([text], { type: "text/plain" }),
      });
      navigator.clipboard.write([clipboardItem]).then(() => {
        showMessage("Copied text", 1500);
      }).catch(() => showMessage("Error copying 😔"));
    } else {
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([link], { type: "text/plain" }),
      });
      navigator.clipboard.write([clipboardItem]).then(() => {
        showMessage("Copied link", 1500);
      }).catch(() => {
        showMessage("Error copying 😔", 1500);
      });
    }
  }

  return (
    <button
      class="text-blue-500 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200"
      type="button"
      onClick={copy}
      onDblClick={copyText}
      onContextMenu={(e) => {
        e.preventDefault();
        copyText();
      }}
      title="Copy (right/dbl click text only)"
      aria-label="Copy (right/dbl click text only)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      </svg>
    </button>
  );
}
