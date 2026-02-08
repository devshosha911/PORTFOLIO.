// Service Worker for PWA
const CACHE_NAME = 'portfolio-v7';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './enhancements.css',
    './script.js',
    './enhancements.js',
    './advanced-features.js',
    './dynamic-loader.js',
    './admin.html',
    './admin.css',
    './admin-ultimate.js',
    './cassino._opt.jpg',
    './Futuristic._opt.jpg',
    './cloud._opt.jpg',
    './mobileapp._opt.jpg',
    './platform._opt.jpg',
    './profile.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Cache-first with network fallback; document fallback to index.html
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(cached => {
            if (cached) return cached;
            return fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => { });
                    return response;
                })
                .catch(() => {
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                    return new Response('', { status: 503, statusText: 'Service Unavailable' });
                });
        })
    );
});

// Update service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
