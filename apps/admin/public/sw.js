// Basic service worker for PWA installation criteria
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = {
            body: data.body || 'You have a new message',
            icon: data.icon || '/logo.png', // Fallback to a default icon
            badge: '/badge.png',
            data: {
                url: data.url || '/dashboard/queries',
            },
            vibrate: [100, 50, 100],
            actions: [
                { action: 'open', title: 'View Details' },
                { action: 'close', title: 'Close' },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'New Notification', options)
        );
    } catch (error) {
        console.error('Error handling push event:', error);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window open with this URL
            for (let client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window found, open a new one
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});
