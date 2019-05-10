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
  repository_url: process.env.REPOSITORY_URL || 'unknown',
  branch: process.env.BRANCH || 'unknown',
  commit: process.env.COMMIT_REF || 'unknown'
}
