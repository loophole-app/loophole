const PRECACHE = "precache-v1";
const RUNTIME = "runtime";
const PRECACHE_URLS = [
	'/index.html',
	'./',
	'/css/main.css',
	'/js/main.js',
	'/js/defer.js',
	'/icon/loophole-large.png',
	'/icon/apple-touch-icon.png',
	'/icon/loophole.png',
	'/img/loader.png'
];
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS))
		.then(self.skipWaiting())
	);
});
self.addEventListener('activate', event => {
	const currentCaches = [PRECACHE, RUNTIME];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});
self.addEventListener('fetch', event => {
	if(event.request.url.startsWith(self.location.origin)) {
		event.respondWith(async function() {
			const cache = await caches.open(RUNTIME);
			const cachedResponse = await cache.match(event.request);
			const networkResponsePromise = fetch(event.request);
			event.waitUntil(async function() {
				const networkResponse = await networkResponsePromise;
				await cache.put(event.request, networkResponse.clone());
			}());
			return cachedResponse || networkResponsePromise;
		}());
	}
});
