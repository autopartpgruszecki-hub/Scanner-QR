const CACHE_NAME = "qr-scanner-cache-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",

  // zewnętrzna biblioteka do QR – też próbujemy cache'ować
  "https://unpkg.com/html5-qrcode"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.error("Cache addAll error:", err);
      });
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// przechwytywanie wszystkich requestów
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // jeśli mamy w cache → użyj
      if (cachedResponse) {
        return cachedResponse;
      }
      // inaczej normalny fetch z sieci
      return fetch(event.request).catch(() => {
        // można tu zwrócić stronę awaryjną jeśli chcesz
      });
    })
  );
});
