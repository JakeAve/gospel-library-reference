const SEARCH_PARAM = "find";
const VOLUMES_PARAM = "volumes";
const BOOKS_PARAM = "books";

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

export function addFiltersToUrl(volumes: string[], books: string[]): void {
  const url = new URL(globalThis.location.href);

  url.searchParams.delete(VOLUMES_PARAM);
  url.searchParams.delete(BOOKS_PARAM);

  if (volumes.length > 0) {
    url.searchParams.set(VOLUMES_PARAM, volumes.join(","));
  }
  if (books.length > 0) {
    url.searchParams.set(BOOKS_PARAM, books.join(","));
  }

  globalThis.history.replaceState({}, "", url);
}

export function readFiltersFromURL(): { volumes: string[]; books: string[] } {
  try {
    const url = new URL(globalThis.location.href);

    const volumesParam = url.searchParams.get(VOLUMES_PARAM);
    const booksParam = url.searchParams.get(BOOKS_PARAM);

    return {
      volumes: volumesParam ? volumesParam.split(",").filter(Boolean) : [],
      books: booksParam ? booksParam.split(",").filter(Boolean) : [],
    };
  } catch {
    return { volumes: [], books: [] };
  }
}
