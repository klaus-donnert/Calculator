// service-worker.js
const CACHE_NAME = 'calc-pwa-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/script.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: Cache files when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => self.skipWaiting()) // Activate immediately after install
  );
});

// Activate: Clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // Take control of pages immediately
  );
});

// Fetch: Prefer cache, fallback to network only if not cached
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, even if online
      if (cachedResponse) {
        return cachedResponse;
      }
      // Fallback to network if not in cache (won't happen for FILES_TO_CACHE)
      return fetch(event.request).catch(() => {
        // If network fails (e.g., offline and no cache), return a fallback
        return new Response('Offline and no cached version available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});