const CACHE = 'kasir-v1';
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(['/','index.html']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('firebase') || e.request.url.includes('gstatic')) return;
  e.respondWith(caches.match(e.request).then(function(c){
    return c || fetch(e.request).catch(function(){ return caches.match('index.html'); });
  }));
});