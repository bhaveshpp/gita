const CACHE_NAME = 'gita';
const urlsToCache = [
    '/'
];

self.addEventListener('install', event=>{
    event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
}
);

self.addEventListener('fetch', event=>{
    event.respondWith(caches.match(event.request).then(response=>{
        // Cache hit - return response
        if (response) {
            return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response=>{
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched response
            caches.open(CACHE_NAME).then(cache=>{
                cache.put(event.request, responseToCache);
            }
            );

            return response;
        }
        ).catch(error=>{
            // Network request failed, return a fallback response
            return new Response('Network request failed. You are offline.');
        }
        );
    }
    ));
}
);

self.addEventListener('activate', event=>{
    event.waitUntil(caches.keys().then(cacheNames=>{
        return Promise.all(cacheNames.filter(cacheName=>{
            // Delete outdated caches
            return cacheName !== CACHE_NAME;
        }
        ).map(cacheName=>{
            return caches.delete(cacheName);
        }
        ));
    }
    ));
}
);

// Notification.requestPermission(function(status) {
//     console.log('Notification permission status:', status);
// });
// if (Notification.permission === 'granted') {
//     new Notification('જય શ્રી કૃષ્ણ!');
// }