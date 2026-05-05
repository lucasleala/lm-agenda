const CACHE = 'lm-agenda-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) {}
  const title = data.title || 'LM Agenda';
  const options = {
    body:  data.body  || '',
    tag:   data.tag   || 'lm-notif',
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    silent: false,
    requireInteraction: false,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
