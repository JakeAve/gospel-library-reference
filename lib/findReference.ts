import { ReferenceMatch } from "@jakeave/scripture-ref/types";

export async function findReference(
  ref: string,
  { start, end }: { start: number; end: number },
): Promise<ReferenceMatch[]> {
  try {
    const apiUrl = globalThis.API_URL;

    if (!apiUrl) {
      throw new Error();
    }

    const url = new URL(apiUrl + "/find");

    url.searchParams.append("ref", ref);
    url.searchParams.append("start", start.toString());
    url.searchParams.append("end", end.toString());

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
