
// AFIT Campus Navigator Service Worker
const CACHE_NAME = 'afit-campus-nav-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/firebase-config.js',
  '/src/geofence-data.js',
  '/src/campus-app.js',
  '/src/service-worker-registration.js',
  '/placeholder.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js',
  'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache for next time
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          // If fetch fails and no cache, return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          throw error;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
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
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push message received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icons/action-explore.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/action-close.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'AFIT Campus Navigator', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app and navigate to relevant section
    event.waitUntil(
      clients.openWindow('/?notification=true')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for background sync
async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    console.log('Performing background sync...');
    
    // This would sync any offline actions like:
    // - Incident reports
    // - User preferences
    // - Cached search queries
    
    return Promise.resolve();
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error;
  }
}

// Message handling for communication with main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('AFIT Campus Navigator Service Worker loaded');
