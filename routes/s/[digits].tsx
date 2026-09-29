import { type Context, page, type PageProps } from "fresh";
import type { Reference } from "@jakeave/scripture-ref/types";
import { decode } from "../../lib/refCodec.ts";
import Header from "../../components/Header.tsx";
import ScriptureReference from "../../components/ScriptureReference.tsx";
import { ToastProvider } from "../../islands/Contexts/Toast.tsx";
import SaveAllBtn from "../../islands/SaveAllBtn.tsx";

interface Data {
  refs: Reference[];
}

export function handler(ctx: Context<unknown>) {
  let refs: Reference[] = [];
  try {
    refs = decode(ctx.params.digits);
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
  }
  return page<Data>({ refs }, refs.length ? undefined : { status: 400 });
}

export default function SharedList({ data: { refs } }: PageProps<Data>) {
  if (!refs.length) {
    return (
      <main>
        <Header />
        <div class="flex flex-col items-center max-w-lg px-4 mx-auto mt-16 text-center gap-4">
          <h2 class="text-lg tracking-widest">This link looks broken</h2>
          <p class="text-sm">
            Part of it may have been cut off. Scan the QR code again, or ask for
            a fresh link.
          </p>
          <a
            href="/"
            class="flex items-center min-h-[44px] px-2 underline text-blue-600 dark:text-blue-400"
          >
            Go to GospelLibrary.Link
          </a>
        </div>
      </main>
    );
  }

  return (
    <ToastProvider>
      <main>
        <Header />
        <div class="bg-neutral-50 dark:bg-neutral-800 shadow-[0px_40px_80px_rgba(0,0,0,0.1)] dark:shadow-[0px_40px_80px_rgba(255,255,255,0.05)]">
          <div class="flex flex-col max-w-lg px-4 py-4 mx-auto gap-3">
            <div>
              <div class="text-xs tracking-[0.2rem]">SHARED LIST</div>
              <div class="text-sm">
                {refs.length} {refs.length === 1 ? "reference" : "references"}
              </div>
            </div>
            <SaveAllBtn refs={refs} />
          </div>
        </div>
        <div class="flex flex-col max-w-lg px-4 pb-8 mx-auto mt-4 text-sm gap-2">
          {refs.map((r, i) => (
            <div
              key={i}
              class="px-2 py-3 odd:bg-neutral-200 odd:dark:bg-neutral-700"
            >
              <ScriptureReference {...r} />
            </div>
          ))}
        </div>
      </main>
    </ToastProvider>
  );
}
