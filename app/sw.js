/* Offline shell. App files are cached on install and served cache-first so
   the app opens instantly and works with no signal. API calls are never
   cached — they always go to the network. */

const CACHE = 'trimpath-v14';
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
  './js/vision.js',
  './js/photos.js',
  './js/intake.js',
  './js/prep.js',
  './js/move.js',
  './js/install.js',
  './js/voice.js',
  './js/updates.js',
  './js/fasting.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* The page needs two things from here: the ability to activate a waiting
   version on demand, and an honest answer about which version is running.
   Without the first, a new worker sits waiting until every tab is closed —
   which on an installed iOS app can be never. */
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'VERSION') e.ports?.[0]?.postMessage(CACHE);
});

self.addEventListener('install', e => {
  e.waitUntil(
    /* Deliberately NOT skipWaiting() here. A new worker that activates the
       moment it downloads reloads the page under whoever is using it —
       which could be mid-way through correcting a meal estimate. Instead it
       waits, the app shows a bar, and the person decides when. The page
       activates it by posting SKIP_WAITING.

       On a first install there is no existing worker, so there is no waiting
       phase and this costs nothing. */
    caches.open(CACHE).then(c => c.addAll(SHELL))
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
