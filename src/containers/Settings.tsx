import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import Axios from 'axios'

import Config from '../config'
import appStore from '../stores/app'

import Settings from '../presenters/Settings'
import seaClient from '../util/seaClient'
import { urlB64ToUint8Array } from '../util/urlB64ToUint8Array'

export default () => {
  const [commitState, setCommitState] = useState({})
  const [subscriptionCount, setSubscriptionCount] = useState(0)
  const [subscriptionState, setSubscriptionState] = useState(2)
  const subscriptionMessages = [
    'not supported',
    'subscribe',
    'loading...',
    'unsubscribe'
  ]
  const [SWR, setSWR] = useState(null as ServiceWorkerRegistration | null)
  const [applicationServerKey, setApplicationServerKey] = useState(
    null as Uint8Array | null
  )
  const subscribe = async () => {
    if (SWR == null) return
    if (applicationServerKey === null) return
    const subscription = await SWR.pushManager.getSubscription()
    if (subscription === null) {
      setSubscriptionState(2)
      const payload = await SWR.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      await seaClient.post('/v1/webpush/subscriptions', JSON.stringify(payload))
      setSubscriptionState(3)
    } else {
      await subscription.unsubscribe()
      setSubscriptionState(1)
    }
    const count = await seaClient.get('/v1/webpush/subscriptions')
    setSubscriptionCount(count.length)
  }
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      ;(async () => {
        const sw = await navigator.serviceWorker.register('/service-worker.js')
        try {
          const server_key = await seaClient.get('/v1/webpush/server_key')
          setApplicationServerKey(
            urlB64ToUint8Array(server_key.applicationServerKey)
          )
          const subscription = await sw.pushManager.getSubscription()
          const remote = await seaClient.get('/v1/webpush/subscriptions')
          setSubscriptionCount(remote.length)
          if (subscription != null) {
            if (
              !remote.filter(
                (rsub: any) => rsub.endpoint == subscription.endpoint
              )
            ) {
              await subscription.unsubscribe()
              setSubscriptionState(1)
            } else {
              setSubscriptionState(3)
            }
          } else {
            setSubscriptionState(1)
          }
        } catch (error) {
          console.warn('webpush is not supported on upstream')
          setSubscriptionState(0)
        }
        setSWR(sw)
      })()
    } else {
      setSubscriptionState(0)
    }
    if (Config.commit_fetch_url) {
      Axios.get(Config.commit_fetch_url).then(resp => {
        setCommitState(resp.data[0])
      })
    }
  }, [])

  return useObserver(() => {
    if (!appStore.me) return <>Being shown...</>
    return (
      <Settings
        name={appStore.me.name}
        screenName={appStore.me.screenName}
        createdAt={appStore.me.createdAt}
        avatar={appStore.me.avatarFile}
        onClickLogout={e => {
          e.preventDefault()
          appStore.logout()
        }}
        commitState={commitState}
        subscriptionCount={subscriptionCount}
        subscriptionState={subscriptionState}
        subscriptionButtonMessages={subscriptionMessages}
        subscribe={subscribe}
      />
    )
  })
}
