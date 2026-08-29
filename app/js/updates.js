/* Getting a new version onto a phone that already has the old one.

   This is harder than it sounds and the first attempt got it wrong in three
   compounding ways, so the reasoning is written down.

   1. The service worker serves from cache first, which is what makes the app
      open instantly and work with no signal. The cost is that you are always
      looking at the version from last time; a new one downloads quietly and
      shows up on some later launch.

   2. Registering the worker and walking away means nothing ever asks whether
      a new one exists. The browser only re-fetches sw.js on a navigation.

   3. On iOS, tapping a home-screen app usually RESUMES it rather than
      loading it. There is no navigation, so point 2 never fires. The app can
      sit on a months-old build forever and look perfectly healthy.

   The fix is to ask explicitly — on load, and every time the app comes back
   to the foreground — and then to tell the person plainly that a new version
   is ready rather than hoping they relaunch enough times. */

let registration = null;
let onReadyCb = null;
let reloading = false;

/**
 * @param onReady  called when a new version is downloaded and waiting
 */
export async function initUpdates(onReady) {
  onReadyCb = onReady;
  if (!('serviceWorker' in navigator)) return;

  try {
    registration = await navigator.serviceWorker.register('sw.js');
  } catch {
    return;                       // no worker: the app still works, just online
  }

  // Already sitting on one from a previous visit.
  if (registration.waiting && navigator.serviceWorker.controller) ready();

  registration.addEventListener('updatefound', () => {
    const fresh = registration.installing;
    if (!fresh) return;
    fresh.addEventListener('statechange', () => {
      // A controller already exists, so this is an update rather than a
      // first install — worth telling someone about.
      if (fresh.state === 'installed' && navigator.serviceWorker.controller) ready();
    });
  });

  // The new worker took over; show them the new version rather than a
  // half-old page.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });

  // The two moments worth asking on iOS: opening, and coming back.
  checkNow();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkNow();
  });
  window.addEventListener('focus', checkNow);
}

function ready() { onReadyCb?.(); }

/** Ask the server whether sw.js has changed. Safe to call often. */
export async function checkNow() {
  if (!registration) return false;
  try {
    await registration.update();
    return !!registration.waiting;
  } catch {
    return false;                 // offline, most likely
  }
}

/** Activate the waiting version. The page reloads via controllerchange. */
export function applyUpdate() {
  const waiting = registration?.waiting;
  if (!waiting) { location.reload(); return; }
  waiting.postMessage('SKIP_WAITING');
}

/**
 * Which version is actually running — asked of the worker itself rather than
 * read from a constant in the page, because the whole question here is
 * whether the page and the worker agree.
 */
export function runningVersion() {
  return new Promise(resolve => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) { resolve(null); return; }
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 1200);
    ch.port1.onmessage = e => { clearTimeout(timer); resolve(e.data); };
    try { sw.postMessage('VERSION', [ch.port2]); }
    catch { clearTimeout(timer); resolve(null); }
  });
}
