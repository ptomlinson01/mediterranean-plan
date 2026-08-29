/* Meal photos.

   Pictures are big and localStorage is small — about 5 MB, and it already
   holds the profile, the plan, the weight history and the chat. So the photo
   goes into IndexedDB as a blob and the day log keeps nothing but its id.

   Every call here fails quietly. If IndexedDB is unavailable — private
   browsing, an old webview, a full disk — you lose the thumbnails and keep
   everything that matters. The numbers are the log; the picture is a memory
   aid. */

/* DO NOT RENAME — see the note on KEY in store.js. Renaming this orphans
   every meal photo already on the device. */
const DB_NAME = 'medplan-photos';
const STORE = 'photos';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    let req;
    try { req = indexedDB.open(DB_NAME, 1); }
    catch (err) { reject(err); return; }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('The photo store would not open.'));
  });
  // One bad open must not poison every later call.
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

function run(mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    let request;
    try { request = fn(t.objectStore(STORE)); }
    catch (err) { reject(err); return; }
    t.oncomplete = () => resolve(request ? request.result : undefined);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('The photo store aborted.'));
  }));
}

export function newPhotoId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** @returns true if the picture was actually stored. */
export async function putPhoto(id, blob) {
  try { await run('readwrite', s => s.put(blob, id)); return true; }
  catch (e) { console.warn('Could not save the photo — the entry itself is fine.', e); return false; }
}

/* Object URLs are cached per id so re-rendering Today doesn't leak one per
   paint, and revoked when the photo goes away. */
const urls = new Map();

export async function photoURL(id) {
  if (!id) return null;
  if (urls.has(id)) return urls.get(id);
  try {
    const blob = await run('readonly', s => s.get(id));
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    urls.set(id, url);
    return url;
  } catch { return null; }
}

function release(id) {
  const url = urls.get(id);
  if (url) { URL.revokeObjectURL(url); urls.delete(id); }
}

export async function deletePhoto(id) {
  if (!id) return;
  release(id);
  try { await run('readwrite', s => s.delete(id)); } catch { /* already gone */ }
}

/** Drop every photo the day log no longer points at. Runs once on launch. */
export async function prunePhotos(keepIds) {
  const keep = new Set(keepIds);
  try {
    await run('readwrite', store => {
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = () => {
        const cur = cursorReq.result;
        if (!cur) return;
        if (!keep.has(cur.key)) { release(cur.key); cur.delete(); }
        cur.continue();
      };
      return null;
    });
  } catch { /* housekeeping never blocks the app */ }
}
