// API and HTML/JS/CSS are never cached so data is always fresh.
// Cache-first is used only for static assets (fonts, icons, images).
const CACHE_NAME = 'knowledge-explorer-static-v1';
const urlsToCache = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - pre-cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log('Cache install failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches (e.g. previous knowledge-explorer-v1)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: API/data and HTML/JS/CSS = network-only. Static assets = cache-first.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // (a) API and data – always from network, never cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // (b) HTML / JS / CSS – always from network, never cache
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // (c) Static assets (fonts, icons, images) – cache-first
  if (request.destination === 'font' || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (request.method !== 'GET' || !response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Default: network-only (do not cache unknown types)
  event.respondWith(fetch(request));
});


