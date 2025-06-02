// public/sw.js

const CACHE_NAME = 'kairos-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or fetch from network
self.addEventListener('fetch', event => {
  // Skip for non-GET requests and browser extensions
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension') ||
    event.request.url.includes('extension')
  ) {
    return;
  }
  
  // Skip for API requests that should never be cached
  if (
    event.request.url.includes('/api/') || 
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('api.anthropic.com')
  ) {
    // For API requests, use network first, then fallback to cached response
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses for offline use
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network request fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // If found in cache, return the cached version
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache the fetched response
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
      })
      .catch(error => {
        console.error('Fetch error:', error);
        
        // For navigation requests, serve the fallback page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        // For image requests, serve a placeholder
        if (event.request.destination === 'image') {
          return caches.match('/placeholder-image.png');
        }
        
        // Otherwise, return an error response
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'journal-upload') {
    event.waitUntil(syncJournalEntries());
  }
});

// Function to sync pending journal entries
async function syncJournalEntries() {
  try {
    // Open the IndexedDB database to get pending uploads
    const db = await openDatabase();
    const pendingUploads = await getPendingUploads(db);
    
    if (pendingUploads.length === 0) {
      return;
    }
    
    // Process each pending upload
    for (const upload of pendingUploads) {
      try {
        // Send the upload to the server
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(upload)
        });
        
        if (response.ok) {
          // Remove the successful upload from pending
          await removePendingUpload(db, upload.id);
        }
      } catch (error) {
        console.error('Error processing upload:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncJournalEntries:', error);
    throw error;
  }
}

// Helper functions for IndexedDB operations
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KairosDB', 1);
    
    request.onerror = event => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = event => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingUploads')) {
        db.createObjectStore('pendingUploads', { keyPath: 'id' });
      }
    };
  });
}

function getPendingUploads(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingUploads'], 'readonly');
    const store = transaction.objectStore('pendingUploads');
    const request = store.getAll();
    
    request.onerror = event => {
      reject('Error getting pending uploads');
    };
    
    request.onsuccess = event => {
      resolve(event.target.result);
    };
  });
}

function removePendingUpload(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingUploads'], 'readwrite');
    const store = transaction.objectStore('pendingUploads');
    const request = store.delete(id);
    
    request.onerror = event => {
      reject('Error removing pending upload');
    };
    
    request.onsuccess = event => {
      resolve();
    };
  });
}

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Time for your daily journal entry!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Καιρός Journal', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    const urlToOpen = new URL('/', self.location.origin).href;
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});