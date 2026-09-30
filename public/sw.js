// Service worker enxuto: apenas ciclo de vida.
// Não faz cache agressivo para não servir cardápio desatualizado
// nem apagar caches de outras versões sem controle.
const SW_VERSION = 'pizzaria-lobo-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('pizzaria-lobo-') && key !== SW_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
