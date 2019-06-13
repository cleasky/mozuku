self.addEventListener('push', event => {
  const parsed = JSON.parse(event.data.text())
  console.log(parsed)
  const post = parsed.post
  const title = `${post.user.name} (@${post.user.screenName}) replied`
  const options = {
    body: post.text,
    icon: post.user.icon
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
