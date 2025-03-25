// Service worker version for cache management
const VERSION = "v1"

// Files to cache on install
const defaultCache = [
    "/offline",
    "/favicon.ico",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/favicon-32x32.png",
    "/favicon-16x16.png",]

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
        caches
            .match(event.request)
            .then((response) => {
                return (
                    response ||
                    fetch(event.request).then((fetchResponse) => {
                        // Don't cache API requests or non-GET requests
                        if (!event.request.url.includes("/api/") && event.request.method === "GET") {
                            return caches.open(VERSION).then((cache) => {
                                cache.put(event.request, fetchResponse.clone())
                                return fetchResponse
                            })
                        }
                        return fetchResponse
                    })
                )
            })
            .catch(() => {
                // Return a fallback for navigation requests
                if (event.request.mode === "navigate") {
                    return caches.match("/offline")
                }
                return new Response("Network error happened", {
                    status: 408,
                    headers: { "Content-Type": "text/plain" },
                })
            }),
    )
})

