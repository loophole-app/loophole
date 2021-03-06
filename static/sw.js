const CACHE_NAME = 'cache-v2';
const URLS = [
	'/',
	'/static/vue.js',
	'/static/vue-router.js',
	'/static/fa/css/all.css',
	'/static/main.js',
	'/static/templates/default.js',
	'/static/512.webp',
	'/static/512.png',
	'/static/192.webp',
	'/static/192.png'
];
self.addEventListener('install', event => {
	event.waitUntil(async function() {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(URLS);
	}());
});
self.addEventListener('fetch', event => {
	const { request } = event;
	if(request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return
	}
	event.respondWith(async function() {
		const cache = await caches.open(CACHE_NAME);
		const cachedResponsePromise = await cache.match(request);
		const networkResponsePromise = fetch(request);
		if(request.url.startsWith(self.location.origin) && !(new URL(request.url).pathname.startsWith('/api'))) { // DO NOT CACHE API REQUESTS!!!
			event.waitUntil(async function() {
				const networkResponse = await networkResponsePromise;
				await cache.put(request, networkResponse.clone());
			}());
		}
		return cachedResponsePromise || networkResponsePromise;
	}());
});
self.addEventListener('activate', event => {
	event.waitUntil(async function() {
		const cacheNames = await caches.keys();
		await Promise.all(
			cacheNames.filter((cacheName) => {
				const deleteThisCache = cacheName !== CAHCE_NAME;
				return deleteThisCache;
			}).map(cacheName => caches.delete(cacheName))
		);
	}());
});