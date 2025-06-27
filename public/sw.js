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