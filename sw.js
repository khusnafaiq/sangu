// Offline cache for the app shell. Only used when the app is served over https or localhost.
// - The page (navigations, ./ and ./index.html) is network-first and revalidated with the server on every
//   load (cache: 'no-cache', so a stale HTTP-cached copy is never used); the cache is only the offline fallback.
// - Icons and the manifest are cache-first.
// - A new build (new 24558f67e9, so a new worker) installs, takes over at once (skipWaiting + clients.claim)
//   and the open page reloads onto it or offers to (see the controllerchange handler in the page).
// - The page itself must be cached before a new worker may take over: if the connection drops while it downloads,
//   the install fails, the old worker and its cache (the offline copy) stay, and the browser tries again later.
// Cross-origin requests (the OCR engine, the push Worker) are left to the browser.
// Notifications (push, notificationclick, pushsubscriptionchange) are at the end of this file.
const CACHE = 'sangu-24558f67e9';
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
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = appUrl(event.notification.data && event.notification.data.url);
  const scope = self.registration.scope;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
    const mine = wins.filter((w) => w.url.indexOf(scope) === 0);
    const win = mine.find((w) => w.focused) || mine[0];
    if (!win) return self.clients.openWindow ? self.clients.openWindow(url) : null;
    const tell = () => { win.postMessage({ type: 'sangu-open', url }); };
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
