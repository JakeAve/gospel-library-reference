import { computed, Signal } from "@preact/signals";
import type { Reference } from "@jakeave/scripture-ref/types";

interface Props {
  heightSignal: Signal<string>;
  inputSignal: Signal<string>;
  referenceSignal: Signal;
  resultsSignal: Signal<Reference[]>;
  toggleHeight: () => void;
}

export const EXPANDED_HEIGHT = "max-h-[50dvh] pb-8";
export const COLLAPSED_HEIGHT = "max-h-0 pb-0";

export default function ToggleHeight(props: Props) {
  const {
    heightSignal,
    inputSignal,
    referenceSignal,
    resultsSignal,
    toggleHeight,
  } = props;

  const icon = computed(() => {
    if (heightSignal.value === EXPANDED_HEIGHT) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="m256-424-56-56 280-280 280 280-56 56-224-223-224 223Z" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      );
    }
  });

  const text = computed(() =>
    heightSignal.value === EXPANDED_HEIGHT ? "Collapse" : "Expand"
  );

  if (
    !inputSignal.value ||
    (!resultsSignal.value.length && !referenceSignal.value)
  ) {
    return null;
  }

  return (
    <button
      class="absolute z-20 p-1 rounded-full bottom-4 right-1/2 translate-x-1/2 bg-neutral-50 dark:bg-neutral-800"
      type="button"
      aria-label={text}
      title={text}
      onClick={toggleHeight}
    >
      {icon}
    </button>
  );
}
