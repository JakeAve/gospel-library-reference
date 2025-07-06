const SEARCH_PARAM = "find";

export function addFindToUrl(input: string): void {
  const url = new URL(globalThis.location.href);
  url.searchParams.delete(SEARCH_PARAM);
  url.searchParams.append(SEARCH_PARAM, input);
  globalThis.history.replaceState({}, "", url);
}

export function readFindFromURL(): string {
  try {
    const url = new URL(globalThis.location.href);
    const find = url.searchParams.get(SEARCH_PARAM);
    return find || "";
  } catch {
    return "";
  }
}
