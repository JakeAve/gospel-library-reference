export function findMatchIdxs({
  content: rawContent,
  match: rawMatch,
}: {
  content: string;
  match: string;
}): [number, number] | null {
  const content = rawContent.toUpperCase();
  const match = rawMatch.trim();

  const words = match.split(" ");

  if (!words.length) {
    return null;
  }

  if (words.length === 1) {
    const start = content.indexOf(words[0]);
    const end = start + words[0].length;
    return [start, end];
  }

  let wIdx = 0;
  let curr = words[wIdx];

  let startIdx = 0;
  let endIdx = content.length;

  let lastPos = 0;
  let i = 0;

  while (wIdx < words.length - 1 && i < 100) {
    const idx = content.indexOf(curr, lastPos);

    if (idx === -1) {
      break;
    }

    const nextWord = words[wIdx + 1];
    const nextIdx = content.indexOf(nextWord, idx);

    if (nextIdx !== -1 && nextIdx < idx + curr.length + 3) {
      if (wIdx === 0) {
        startIdx = idx;
      }
      wIdx++;
      curr = words[wIdx];
      lastPos = idx;
      endIdx = nextIdx + nextWord.length;
    } else {
      lastPos = idx + 1;
    }
    i++;
  }

  if (startIdx === 0 && endIdx === content.length) {
    return null;
  }

  return [startIdx, endIdx];
}
