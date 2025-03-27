import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="px-4 py-8 mx-auto dark:bg-neutral-800 dark:text-neutral-200">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <p class="my-4">
            Nothing is here.
          </p>
          <a href="/" class="underline">Go to app</a>
        </div>
      </div>
    </>
  );
}
