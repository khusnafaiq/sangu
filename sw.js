// Offline cache for the app shell. Only used when the app is served over https or localhost.
// - The page (navigations, ./ and ./index.html) is network-first and revalidated with the server on every
//   load (cache: 'no-cache', so a stale HTTP-cached copy is never used); the cache is only the offline fallback.
// - Icons and the manifest are cache-first.
// - A new build (new 8debdfc706, so a new worker) installs, takes over at once (skipWaiting + clients.claim)
//   and the open page reloads onto it or offers to (see the controllerchange handler in the page).
// - The page itself must be cached before a new worker may take over: if the connection drops while it downloads,
//   the install fails, the old worker and its cache (the offline copy) stay, and the browser tries again later.
// Cross-origin requests (the OCR engine, the push Worker) are left to the browser.
// Notifications (push, notificationclick, pushsubscriptionchange) are at the end of this file.
const CACHE = 'sangu-8debdfc706';
const PAGE = './index.html';
// './' is the same page: the fetch handler answers it from './index.html', so it is not downloaded twice
const EXTRAS = ['./manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const SHELL = [PAGE].concat(EXTRAS);

self.addEventListener('install', (event) => {
  // cache: 'reload' skips the HTTP cache, so the new build's files are cached, not an older copy
  const fresh = (url) => new Request(url, { cache: 'reload' });
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(fresh(PAGE))
        // icons and the manifest are nice to have; the page is not optional
        .then(() => Promise.all(EXTRAS.map((url) => cache.add(fresh(url)).catch(() => {})))))
      .then(() => self.skipWaiting())
      .catch((err) => caches.delete(CACHE).then(() => { throw err; }))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith('sangu-')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Always ask the server (a cheap 304 when nothing changed); fall back to a plain fetch if the browser
// refuses to rebuild a navigation request with options.
const fromNetwork = (req) => fetch(req, { cache: 'no-cache' }).catch(() => fetch(req));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) {
    event.respondWith(
      fromNetwork(req)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(PAGE, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(PAGE).then((hit) => hit || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok && SHELL.some((p) => url.pathname.endsWith(p.replace('./', '/')))) {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});

// ---------- Notifications (optional: Settings → Notifikasi Sangu) ----------
// Sangu's own push Worker sends JSON {title, body, url: './index.html#catat', tag, ts}, encrypted for this device.
// With "Titip isi transaksi di notifikasi" on, a push may also carry {n, f}: an id and the fields the Worker read from a
// bank e-mail or screenshot (amount, merchant, date, time, category, bank, ...; never the text itself, see
// Core.push.inboxFields). They are kept in IndexedDB (the inbox, below) before the notification shows, so the app can
// fill in the transaction without Tempel. With the setting off they are dropped at once and the body says Tempel.
// Safari drops a subscription whose pushes show nothing, so every push shows a notification, even an unreadable one.
// Tapping it focuses the open app and tells it to go to Catat (postMessage 'sangu-open'), or opens the app at that URL.
// Check and test pushes open the app without going to Catat (see SETUP_TITLE).
const VAPID_PUBLIC = 'BBlZE-TUwh50bjjOZtMs9TPEvwzWmMHLCYwav3mWxWyjfxi_x13rGi3BWeQj47auMnGb86galXLw7UYvCaVN8OY';
const pushText = (v, max) => (typeof v === 'string' ? v : '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
// Only pages of this app: anything else becomes the app's start page.
function appUrl(u) {
  const scope = self.registration.scope;
  try {
    const abs = new URL(typeof u === 'string' && u ? u : PAGE, scope).href;
    if (abs.indexOf(scope) === 0) return abs;
  } catch (e) { /* not a URL */ }
  return new URL(PAGE, scope).href;
}

// The Worker's check and test pushes (title "Sangu · Notifikasi aktif": sent when notifications are turned on, by
// "Kirim notif tes", or by a Shortcut with test=true) are not payments: tapping one only opens the app as it is (no
// Catat, no Tempel hint, Settings stays open), and they never replace a payment notification. The Worker's test text
// says the Shortcut is connected even when the test came from the app, so a neutral line is shown instead.
const SETUP_TITLE = 'Sangu · Notifikasi aktif';
const SETUP_TAG = 'sangu-setup';
const SETUP_BODY = 'Notifikasi Sangu berfungsi di HP ini.';

// ---------- Inbox: transaction text left by a notification ----------
// IndexedDB 'moneyapp-inbox': store 'items' {n, f, receivedAt} (newest 20, 7 days at most), store 'kv' {optin}.
// The app writes optin (Settings) and reads, saves and removes the items. Off (or no answer): nothing is kept.
const INBOX_DB = 'moneyapp-inbox';
const INBOX_MAX = 20;
const INBOX_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const INBOX_ID_RE = /^[A-Za-z0-9_-]{8,32}$/;
// the fields a push may carry (the app checks each one: Core.push.inboxFields)
const INBOX_FIELDS = ['k', 'ty', 'a', 'ti', 'd', 'dr', 'tm', 'c', 'ap', 'ta', 'm', 'fe', 'st', 'cf'];
const IDB_WAIT_MS = 2500;
function idbOpen() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined' || !indexedDB) { reject(new Error('no IndexedDB')); return; }
    const req = indexedDB.open(INBOX_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'n' });
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('blocked'));
  });
}
// Keeps the item when the app said yes (optin); drops expired and the oldest beyond INBOX_MAX. Resolves true when kept;
// false when the setting is off, IndexedDB fails or takes too long (the notification must show either way).
function inboxKeep(item) {
  const work = idbOpen().then((db) => new Promise((resolve, reject) => {
    let kept = false;
    const tx = db.transaction(['kv', 'items'], 'readwrite');
    const items = tx.objectStore('items');
    const opt = tx.objectStore('kv').get('optin');
    opt.onsuccess = () => {
      // off: nothing stays here, not even older items
      if (opt.result !== true) { items.clear(); return; }
      const all = items.getAll();
      all.onsuccess = () => {
        const now = item.receivedAt;
        const list = (all.result || []).filter((x) => x && x.n !== item.n).sort((a, b) => (b.receivedAt || 0) - (a.receivedAt || 0));
        list.forEach((x, i) => { if (!(now - x.receivedAt < INBOX_TTL_MS) || i >= INBOX_MAX - 1) items.delete(x.n); });
        items.put(item);
        kept = true;
      };
    };
    tx.oncomplete = () => { db.close(); resolve(kept); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  }));
  let timer = 0;
  const late = new Promise((resolve) => { timer = setTimeout(() => resolve(false), IDB_WAIT_MS); });
  return Promise.race([work.catch(() => false), late]).then((v) => { clearTimeout(timer); return v; });
}
// The fields as kept: only the known keys, each a short string (no controls) or a finite number; null when there are
// none (or f is not an object)
function inboxFields(f) {
  if (!f || typeof f !== 'object' || Array.isArray(f)) return null;
  const out = {};
  INBOX_FIELDS.forEach((k) => {
    const v = f[k];
    if (typeof v === 'number' && isFinite(v)) out[k] = v;
    else if (typeof v === 'string' && v && v.length <= 64 && !/[\u0000-\u001f\u007f]/.test(v)) out[k] = v;
  });
  return Object.keys(out).length ? out : null;
}
// Not kept (setting off): the body points at Tempel again, as for a push without text
function tempelBody(body) {
  if (/ketuk untuk simpan$/i.test(body)) return body.replace(/ketuk untuk simpan$/i, 'ketuk untuk Tempel');
  if (/^Ketuk untuk cek & simpan/i.test(body)) return 'Ketuk untuk buka Sangu, lalu Tempel';
  return body;
}

self.addEventListener('push', (event) => {
  let d = null;
  let text = '';
  if (event.data) {
    try { d = event.data.json(); } catch (e) {
      try { text = event.data.text(); } catch (_) { text = ''; }
    }
  }
  if (!d || typeof d !== 'object' || Array.isArray(d)) d = {};
  const title = pushText(d.title, 120) || 'Sangu';
  const setup = title === SETUP_TITLE || d.tag === SETUP_TAG;
  let body = pushText(d.body, 240) || pushText(text, 240);
  if (setup && /shortcut/i.test(body)) body = SETUP_BODY;
  const options = {
    body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: setup ? SETUP_TAG : (pushText(d.tag, 64) || 'sangu-shot'),
    renotify: true,
    data: { url: appUrl(setup ? PAGE : d.url) }
  };
  if (typeof d.ts === 'number' && isFinite(d.ts)) options.timestamp = d.ts;
  const kept = setup ? null : inboxFields(d.f);
  if (!kept || typeof d.n !== 'string' || !INBOX_ID_RE.test(d.n)) {
    // it meant to leave something (fields or an id) that cannot be kept: the body says Tempel
    if ((d.f !== undefined || d.n !== undefined) && !setup) options.body = tempelBody(body);
    event.waitUntil(self.registration.showNotification(title, options));
    return;
  }
  // kept first, shown after: a tap must find the fields
  event.waitUntil(inboxKeep({ n: d.n, f: kept, receivedAt: Date.now() }).then((stored) => {
    if (stored) options.data.n = d.n; else options.body = tempelBody(body);
    return self.registration.showNotification(title, options).then(() => {
      // an open app updates its "Menunggu dicatat" list
      if (!stored) return null;
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((wins) => wins.forEach((w) => { if (w.url.indexOf(self.registration.scope) === 0) w.postMessage({ type: 'sangu-inbox' }); }))
        .catch(() => {});
    });
  }));
});

// A notification with kept fields carries its id (data.n): the app opens that item (cold start: #catat=<id>).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = appUrl(data.url);
  const n = typeof data.n === 'string' && INBOX_ID_RE.test(data.n) && /#catat$/.test(url) ? data.n : '';
  const scope = self.registration.scope;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
    const mine = wins.filter((w) => w.url.indexOf(scope) === 0);
    const win = mine.find((w) => w.focused) || mine[0];
    if (!win) return self.clients.openWindow ? self.clients.openWindow(n ? url + '=' + n : url) : null;
    const tell = () => { win.postMessage(n ? { type: 'sangu-open', url, n } : { type: 'sangu-open', url }); };
    // focus() can be refused; the open app still gets the message (it acts on it when it is shown)
    return Promise.resolve().then(() => win.focus()).then(tell, tell);
  }));
});

// Best effort: the browser replaced or expired the subscription (iOS does not fire this reliably). Subscribe again with
// the same key and ask an open Sangu to register it with the push Worker; that needs the device's token, which only
// the page keeps, so without an open page the next app start does it (same notify URL).
self.addEventListener('pushsubscriptionchange', (event) => {
  const old = event.oldSubscription;
  const key = (old && old.options && old.options.applicationServerKey) ||
    Uint8Array.from(atob(VAPID_PUBLIC.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  event.waitUntil(
    Promise.resolve(event.newSubscription || self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key }))
      .catch(() => null)
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((wins) => wins.forEach((w) => w.postMessage({ type: 'sangu-push-resync' })))
      .catch(() => {})
  );
});
