// service-worker.js// Service worker version for cache management
const VERSION = "v1"

// Files to cache on install - these are important assets that will be available offline
const defaultCache = [
    "/offline",
    "/favicon.ico",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/favicon-32x32.png",
    "/favicon-16x16.png",
    "/logo-round.png",
    // Vous pouvez ajouter d'autres ressources essentielles ici
]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(VERSION).then((cache) => {
            return cache.addAll(defaultCache)
        }),
    )
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== VERSION) {
                        return caches.delete(cacheName)
                    }
                }),
            )
        }),
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        // Stratégie "network first, falling back to cache"
        fetch(event.request)
            .then((response) => {
                // Si la réponse est valide, on la met en cache pour une utilisation ultérieure (hors ligne)
                if (response.ok && !event.request.url.includes("/api/") && event.request.method === "GET") {
                    const responseClone = response.clone();
                    caches.open(VERSION).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // En cas d'échec réseau, on essaie de servir depuis le cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Pour les navigations, renvoyer la page offline
                    if (event.request.mode === "navigate") {
                        return caches.match("/offline");
                    }

                    // Sinon, on renvoie une erreur
                    return new Response("Network error happened", {
                        status: 408,
                        headers: { "Content-Type": "text/plain" },
                    });
                });
            })
    );
})
