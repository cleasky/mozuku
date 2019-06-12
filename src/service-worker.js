self.addEventListener('push', event => {
  const parsed = JSON.parse(event.data.text())
  const title = parsed.title
  const options = {
    body: parsed.body,
    icon: parsed.icon
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
