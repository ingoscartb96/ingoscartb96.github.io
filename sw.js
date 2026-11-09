// Service worker mínimo: sólo para que el teléfono permita instalar la app.
// No guarda nada: cada petición va directo a internet.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* sin caché a propósito */ });
