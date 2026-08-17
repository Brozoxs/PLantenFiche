/* Zorgt dat de app ook zonder internet opent, bijvoorbeeld achter in de tuin.
   Strategie: eerst het net proberen (zo krijg je updates), anders uit de kast. */
const KAST = "plantenfiche-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;  // weerdienst nooit bewaren
  e.respondWith(
    fetch(req)
      .then(res => {
        const kopie = res.clone();
        caches.open(KAST).then(c => c.put(req, kopie)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
