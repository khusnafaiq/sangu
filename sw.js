// Offline cache for the app shell. Only used when the app is served over https or localhost.
// - The page (navigations, ./ and ./index.html) is network-first and revalidated with the server on every
//   load (cache: 'no-cache', so a stale HTTP-cached copy is never used); the cache is only the offline fallback.
// - Icons and the manifest are cache-first.
// - A new build (new d75c33b9d7, so a new worker) installs, takes over at once (skipWaiting + clients.claim)
//   and the open page reloads onto it or offers to (see the controllerchange handler in the page).
// - The page itself must be cached before a new worker may take over: if the connection drops while it downloads,
//   the install fails, the old worker and its cache (the offline copy) stay, and the browser tries again later.
// Cross-origin requests (the OCR engine) are left to the browser.
const CACHE = 'sangu-d75c33b9d7';
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
