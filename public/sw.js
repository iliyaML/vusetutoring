var CACHE_NAME = 'vusetutoring-v1';
var urlsToCache = [
    '/',
    '/about',
    '/css/bootstrap.min.css',
    '/css/custom.css',
    '/img/icons/favicon.ico',
    '/manifest.json',
    '/img/icons/android-icon-36x36.png',
    '/img/icons/android-icon-48x48.png',
    '/img/icons/android-icon-72x72.png',
    '/img/icons/android-icon-96x96.png',
    '/img/icons/android-icon-144x144.png',
    '/img/icons/android-icon-192x192.png',
    '/js/jquery-3.2.1.slim.min.js',
    '/js/popper.min.js',
    '/js/bootstrap.min.js',
    '/js/idb-keyval.min.js',
    '/sw.js'
];

// Install handler
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch handler
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});