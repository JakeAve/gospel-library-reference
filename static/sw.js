const PRE_CACHE = "pre-cache-fb3624e2da6665f55b2abf4860a5fc5ada35cd13";
const RUNTIME = "runtime";

const PRE_CACHE_URLS = [
  "/styles.css",
  "/register.js",
  "/favicon.ico",
  "/",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/main.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-RY6IT6PL.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-GI7LLYGM.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-V66ALGLP.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/deserializer.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/signals.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-SXWANEYB.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-X6DZUWNE.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/island-addform.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-QPRV432R.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-XZ35DVYR.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-LRH5OROV.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/island-copybtn.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/island-main.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/chunk-2IVDUWKS.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/island-referenceitem.js",
  "/_frsh/js/fb3624e2da6665f55b2abf4860a5fc5ada35cd13/metafile.json"
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
