import type { PageProps } from "fresh";
import { Head, HttpError } from "fresh/runtime";

export default function ErrorPage({ error }: PageProps) {
  const is404 = error instanceof HttpError && error.status === 404;

  return (
    <>
      <Head>
        <title>{is404 ? "404 - Page not found" : "Error"}</title>
      </Head>
      <div class="px-4 py-8 mx-auto dark:bg-neutral-800 dark:text-neutral-200">
        <div class="flex flex-col items-center justify-center mx-auto max-w-screen-md">
          <h1 class="text-4xl font-bold">
            {is404 ? "404 - Page not found" : "Something went wrong"}
          </h1>
          <p class="my-4">
            {is404 ? "Nothing is here." : "An unexpected error occurred."}
          </p>
          <a href="/" class="underline">Go to app</a>
        </div>
      </div>
    </>
  );
}
