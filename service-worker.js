const CACHE = "vybe-shell-v7";
const BASE = new URL(".", self.location.href).pathname;
const SHELL = ["", "styles.css", "app.js", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png", "icon-512-maskable.png"].map(file => `${BASE}${file}`);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map(async file => {
      const url = new URL(file, self.location.origin);
      const response = await fetch(new Request(url, { cache: "reload" }));
      if (!response.ok) throw new Error(`Could not cache ${url.pathname}: HTTP ${response.status}`);
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith(`${BASE}api/`) || url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
