const CACHE_NAME = 'mortgage-calc-v1';
const urlsToCache = [
  '/my-calculator/',
  '/my-calculator/index.html',
  '/my-calculator/about.html',
  '/my-calculator/self-employed.html',
  '/my-calculator/hidden-costs.html',
  '/my-calculator/closing-costs.html',
  '/my-calculator/rent-vs-buy.html',
  '/my-calculator/down-payment.html',
  '/my-calculator/refinance.html',
  '/my-calculator/thin-credit.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
