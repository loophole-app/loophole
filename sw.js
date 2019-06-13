const CACHE_NAME = 'cache-v1';
const URLS = [
	'index.html',
	'./',
	'css/main.css',
	'js/main.js',
	'icon/loophole-large.webp',
	'js/defer.js',
	'icon/apple-touch-icon.png',
	'icon/192.png',
	'icon/512.png',
	'img/loader.png'
];
self.addEventListener('install', event => {
	event.waitUntil(async function() {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(URLS);
	}());
});
self.addEventListener('fetch', event => {
	const { request } = event;
	if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return
	}
	event.respondWith(async function() {
		const cache = await caches.open(CACHE_NAME)
		const cachedResponsePromise = await cache.match(request);
		const networkResponsePromise = fetch(request);
		if(request.url.startsWith(self.location.origin)) {
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
				const deleteThisCache = cacheName !== CACHE_NAME;
				return deleteThisCache;
			}).map(cacheName => caches.delete(cacheName))
		);
	}());
});
