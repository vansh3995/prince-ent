// Add to public/sw.js
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/logo.png',
    badge: '/badge.png'
  }
  
  event.waitUntil(
    self.registration.showNotification('Prince Enterprises', options)
  )
})

const CACHE_NAME = 'pe-logistics-v1'
const urlsToCache = [
  '/',
  '/track',
  '/booking',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})