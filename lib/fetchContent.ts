import { ContentFetchError } from "../errors/ContentFetchError.ts";

declare global {
  var API_URL: string | undefined;
}

const DEFAULT_ERROR = "Could not get content";

export async function fetchContent(path: string): Promise<string> {
  try {
    const apiUrl = globalThis.API_URL;

    if (!apiUrl) {
      throw new Error();
    }

    const resp = await fetch(apiUrl + path);

    if (!resp.ok) {
      const json = await resp.json();
      if (json.error && resp.status !== 500) {
        throw new ContentFetchError(json.error);
      }
      throw new Error();
    }

    const json = await resp.json();

    return json.content.join(" ");
  } catch (e) {
    if (e instanceof ContentFetchError) {
      throw e;
    }

    throw new ContentFetchError(DEFAULT_ERROR);
  }
}
