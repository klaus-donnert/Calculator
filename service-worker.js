// service-worker.js
const CACHE_NAME = 'calc-pwa-v2';
const FILES_TO_CACHE = [
  '/calculator/',
  '/calculator/index.html',
  '/calculator/scripts/script.js',
  '/calculator/styles/dark.css',
  '/calculator/assets/favicon-32x32.png',
  '/calculator/assets/android-chrome-192x192.png',
  '/calculator/assets/android-chrome-512x512.png',
  '/calculator/manifest.webmanifest'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Service Worker caching files...');
      return cache.addAll(FILES_TO_CACHE);
    }).then(function() {
      console.log('Service Worker installation complete');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          console.log('Removing old cache:', name);
          return caches.delete(name);
        })
      );
    }).then(function() {
      console.log('Service Worker is now active');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(function() {
        console.log('Offline: Failed to fetch', event.request.url);
        return new Response('Offline and no cached version available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});