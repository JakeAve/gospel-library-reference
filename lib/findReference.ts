import { Reference } from "@jakeave/scripture-ref/types";

export async function findReference(ref: string): Promise<Reference[]> {
  try {
    const apiUrl = globalThis.API_URL;

    if (!apiUrl) {
      throw new Error();
    }

    const url = new URL(apiUrl + "/find");

    url.searchParams.append("ref", ref);

    const resp = await fetch(url.toString());

    if (!resp.ok) {
      throw new Error();
    }

    const json = await resp.json();

    return json.results;
  } catch (e) {
    throw e;
  }
}
