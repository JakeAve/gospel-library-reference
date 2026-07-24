const PRE_CACHE = "pre-cache-v1";
const RUNTIME = "runtime";

// Vite content-hashes JS/CSS output on every build, so exact asset paths
// can't be listed here. They get picked up by the runtime cache below on
// first fetch instead of being precached at install.
const PRE_CACHE_URLS = [
  "/register.js",
  "/favicon.ico",
  "/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRE_CACHE)
      .then((cache) => cache.addAll(PRE_CACHE_URLS))
      .then(self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [PRE_CACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName),
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then(
          (networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          },
        ).catch(() =>
          new Response(
            `<!DOCTYPE html>
<html lang="en" class="bg-slate-500 dark:bg-slate-700">
  <head>
    <title>Offline</title>
    <meta charset="utf-8" />
    </head><body><h1>You have no internet and this page cannot render</h1></body></html>`,
            {
              headers: { "Content-Type": "text/html" },
            },
          )
        );
        return cachedResponse || fetchPromise;
      }),
    );
  }
});
