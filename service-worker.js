// Define el nombre del cache (puedes cambiar 'v1' a 'v2' si haces cambios grandes)
const CACHE_NAME = 'venusian-gems-cache-v1';

// Lista TODOS los archivos que tu juego necesita para funcionar en el navegador.
// Asegúrate de que las rutas sean correctas (relativas a index.html).
const urlsToCache = [
  './', // Representa la pagina principal
  'index.html',
  'venusian.png',
  'mano.gif',
  'venusound.mp3', // ¡CORREGIDO AQUÍ!
  'venusci.mp3',
  'venusciously.mp3', // ¡CORREGIDO AQUÍ!
  'venusliscious.mp3',
  'loser.mp3',
  // Si tienes archivos .ogg, agregalos aqui tambien:
  'venusound.ogg', // Agrega si conviertes a OGG
  'venusci.ogg',   // Agrega si conviertes a OGG
  'venusciously.ogg', // Agrega si conviertes a OGG
  'venusliscious.ogg', // Agrega si conviertes a OGG
  'loser.ogg'      // Agrega si conviertes a OGG
  // ¡IMPORTANTE! Agrega aqui cualquier otro archivo .css o .js que use tu juego si no esta incrustado.
  // Pero con este HTML unificado, solo necesitarian estar si los separas de nuevo.
];

// Evento 'install': se activa la primera vez que el Service Worker se instala
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto, agregando archivos...');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Fallo al cachear archivos:', error);
      })
  );
});

// Evento 'fetch': intercepta cada peticion que hace tu juego (para buscar imagenes, sonidos, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo ya esta en cache, lo devuelve inmediatamente
        if (response) {
          return response;
        }
        // Si no esta en cache, hace la peticion normal a la red
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Service Worker: Error en fetch:', error);
      })
  );
});

// Evento 'activate': limpia caches antiguos si actualizas tu PWA
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; 
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});
