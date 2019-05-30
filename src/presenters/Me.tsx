import * as React from 'react'

export default ({
  name,
  screenName,
  createdAt
}: {
  name: string
  screenName: string
  createdAt: Date
}) => {
  return (
    <>
      You are "{name}" (@{screenName}). This account was created at{' '}
      {createdAt.toLocaleString()}.
    </>
  )
}
