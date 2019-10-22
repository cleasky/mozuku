if (
  !process.env.CLIENT_ID ||
  !process.env.CLIENT_SECRET ||
  !process.env.OAUTH_URL ||
  !process.env.API_URL
)
  throw new Error('Application can not be booted.')

export default {
  app: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  oauth: process.env.OAUTH_URL,
  api: process.env.API_URL,
  repository_url: process.env.REPOSITORY_URL
    ? process.env.REPOSITORY_URL.split('@')[1]
    : null,
  commit: process.env.COMMIT_REF
    ? `${process.env.BRANCH}@${process.env.COMMIT_REF}`
    : null,
  commit_fetch_url: process.env.COMMIT_FETCH_URL
    ? process.env.COMMIT_FETCH_URL
    : null,
  post_sound:
    JSON.parse(
      localStorage.getItem('Mozukusu::AppPreference::PostSound') || 'false'
    ) || false,
  post_sound_reply:
    JSON.parse(
      localStorage.getItem('Mozukusu::AppPreference::PostSoundReply') || 'false'
    ) || false,
  image_maxsize:
    JSON.parse(
      localStorage.getItem('Mozukusu::AppPreference::ImageMaxsize') || '1000000'
    ) || 1000000,
  image_compression:
    JSON.parse(
      localStorage.getItem('Mozukusu::AppPreference::ImageCompression') ||
        'false'
    ) || false,
  notice_hidden:
    JSON.parse(
      localStorage.getItem('Mozukusu::AppPreference::NoticeHidden') || 'false'
    ) || false
}
