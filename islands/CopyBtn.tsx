import { IS_BROWSER } from "$fresh/runtime.ts";

interface Props {
  link: string;
  text?: string;
}

export function CopyBtn(props: Props) {
  const { link, text } = props;

  if (!IS_BROWSER) {
    return <></>;
  }

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
      .catch(() => alert("Error copying"));
  }

  return (
    <button
      class="text-blue-500 hover:text-blue-700 focus:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 dark:focus:text-blue-200"
      type="button"
      onClick={copy}
      title="Copy"
      aria-label="Copy"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      </svg>
    </button>
  );
}
