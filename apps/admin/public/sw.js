// Basic service worker for PWA installation criteria
self.addEventListener('install', (event) => {
  console.log('SW installed');
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy
});
