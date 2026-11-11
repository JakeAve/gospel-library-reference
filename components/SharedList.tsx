import { useEffect } from "preact/hooks";
import { decodeShared } from "../lib/shareList.ts";
import Header from "./Header.tsx";
import SaveAllBtn from "../islands/SaveAllBtn.tsx";
import Sheet from "../islands/Sheet.tsx";
import { RefRow } from "../islands/Home.tsx";
import { refreshSaved, rememberShared } from "../islands/state.ts";
import { Icon } from "../islands/Icons.tsx";

export default function SharedList({ digits }: { digits: string }) {
  const refs = decodeShared(digits);
  // The sheet's save button needs to know what's already saved.
  useEffect(() => {
    refreshSaved();
    if (refs.length) rememberShared(digits);
  }, []);

  if (!refs.length) {
    return (
      <div class="page">
        <Header />
        <main class="center">
          <h2 class="page-title">This link looks broken</h2>
          <p class="note">
            Part of it may have been cut off. Scan the QR code again, or ask for
            a fresh link
          </p>
          <a href="/">Go to GospelLibrary.Link</a>
        </main>
      </div>
    );
  }

  return (
    <>
      <div class="page">
        <Header />
        <main>
          <a href="/" class="btn-subtle back">
            <Icon name="chevron-left" />
            My list
          </a>
          <h2 class="page-title">Shared with you</h2>
          <p class="sub">
            {refs.length}{" "}
            {refs.length === 1 ? "reference" : "references"}, in the order your
            teacher picked
          </p>
          <SaveAllBtn refs={refs} />
          <ul class="rows">
            {refs.map((r, i) => (
              <li key={i}>
                <RefRow r={r} />
              </li>
            ))}
          </ul>
        </main>
      </div>
      <Sheet />
    </>
  );
}
