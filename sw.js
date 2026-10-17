// Y5 static service worker (offline app shell). Cache changes whenever the page changes.
const V = "y5s-299b7e3679eb";
const SHELL = ["./", "./index.html", "./manifest.webmanifest"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("y5s-") && k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // other sites (the AI provider) are never intercepted or cached
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok && e.request.mode !== "navigate") { const c = r.clone(); caches.open(V).then((x) => x.put(e.request, c)); }
    return r;
  }).catch(() => (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
});
