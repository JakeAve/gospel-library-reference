import { CopyBtn } from "../islands/CopyBtn.tsx";

/**
 * @returns Fragment
 */
export default function ReferenceLink(
  { text, link }: {
    text: string;
    link: string;
  },
) {
  return (
    <>
      <CopyBtn content={link} label={text} />
      <a
        class="flex items-center gap-1"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="underline">{text}</span>{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
          fill="currentColor"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
        </svg>
      </a>
    </>
  );
}
