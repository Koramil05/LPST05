// Service Worker untuk PWA Laporan Koramil
const CACHE_NAME = 'koramil-pwa-v1.0';
const API_CACHE = 'koramil-api-v1.0';
const BASE_PATH = '/LPST05/';

// Assets yang akan di-cache
const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Cache First, Fallback to Network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') return;
  
  // Handle API requests
  if (url.pathname.includes('/macros/s/')) {
    event.respondWith(handleApiRequest(event));
    return;
  }
  
  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Handle API requests with offline support
function handleApiRequest(event) {
  const request = event.request;
  const url = request.url;
  
  return fetch(request)
    .then(response => {
      // Cache successful API responses
      if (response.status === 200) {
        const responseToCache = response.clone();
        caches.open(API_CACHE)
          .then(cache => {
            cache.put(request, responseToCache);
          });
      }
      return response;
    })
    .catch(error => {
      console.log('Network error, trying cache:', error);
      // Try to get from cache
      return caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          
          // If no cache, return offline response
          return new Response(JSON.stringify({
            success: false,
            error: 'Offline mode',
            message: 'Koneksi terputus. Data disimpan lokal.'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
    });
}

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncPendingReports());
  }
});

// Sync pending reports
async function syncPendingReports() {
  try {
    const db = await openDatabase();
    const pendingReports = await getAllPendingReports(db);
    
    for (const report of pendingReports) {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw-Q_BoXGfqH9cFw1djKf1DLnoMBxxyI8efOlgOJyDtiKc1rnpiYOAR8UpaXsFA1P7Irg/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report.data)
        });
        
        if (response.ok) {
          await markReportAsSynced(db, report.id);
          console.log('Report synced:', report.id);
        }
      } catch (error) {
        console.error('Sync error for report:', report.id, error);
      }
    }
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        syncedCount: pendingReports.length
      });
    });
    
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// IndexedDB for offline storage
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('koramil-reports', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('reports')) {
        const store = db.createObjectStore('reports', { keyPath: 'id' });
        store.createIndex('by-date', 'timestamp');
        store.createIndex('by-synced', 'synced');
      }
      
      if (!db.objectStoreNames.contains('pending')) {
        const pendingStore = db.createObjectStore('pending', { keyPath: 'id' });
        pendingStore.createIndex('by-timestamp', 'timestamp');
      }
    };
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

function getAllPendingReports(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending'], 'readonly');
    const store = transaction.objectStore('pending');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function markReportAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Pengingat laporan harian',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Laporan Koramil', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
