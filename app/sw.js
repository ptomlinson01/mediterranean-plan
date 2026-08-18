/* Offline shell. App files are cached on install and served cache-first so
   the app opens instantly and works with no signal. API calls are never
   cached — they always go to the network. */

const CACHE = 'medplan-v2';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './js/app.js',
  './js/store.js',
  './js/nutrition.js',
  './js/recipes.js',
  './js/planner.js',
  './js/ai.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;   // never touch the API

  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) {
        // Refresh in the background so updates land on the next launch.
        fetch(e.request)
          .then(res => res.ok && caches.open(CACHE).then(c => c.put(e.request, res.clone())))
          .catch(() => {});
        return hit;
      }
      return fetch(e.request)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
