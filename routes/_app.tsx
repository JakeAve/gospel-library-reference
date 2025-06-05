// deno-lint-ignore-file react-no-danger
import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gospel Library Link</title>
        <meta
          name="description"
          content="Create links to verses from the Gospel Library App from the Church of Jesus Christ of Latter-day Saints"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link
          crossorigin="use-credentials"
          rel="manifest"
          href="/manifest.json"
        />
        {Deno.env.get("DENO_ENV") !== "development" && (
          <script type="module" src="/register.js" />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.API_URL="${Deno.env.get("API_URL")}";`,
          }}
        >
        </script>
      </head>
      <body class="dark:bg-neutral-800 dark:text-neutral-200">
        <Component />
      </body>
    </html>
  );
}
