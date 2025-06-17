
// Service Worker Registration for PWA
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

function registerSW() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(window.location.href);
    
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
        
        navigator.serviceWorker.ready.then(() => {
          console.log('This web app is being served cache-first by a service worker.');
        });
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('SW registered: ', registration);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              showUpdateAvailable();
            } else {
              console.log('Content is cached for offline use.');
              showOfflineReady();
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('SW registration failed: ', error);
    });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

function showUpdateAvailable() {
  if (window.campusNav) {
    window.campusNav.showNotification(
      'Update Available',
      'A new version is available. Please refresh to update.',
      'info'
    );
  }
}

function showOfflineReady() {
  if (window.campusNav) {
    window.campusNav.showNotification(
      'App Ready',
      'App is ready for offline use.',
      'success'
    );
  }
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Register service worker
registerSW();
