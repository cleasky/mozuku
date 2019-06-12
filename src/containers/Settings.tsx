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
  const [subscriptionState, setSubscriptionState] = useState(2)
  const subscriptionMessages = [
    'not supported',
    'subscribe',
    'loading...',
    'subscribed'
  ]
  const [SWR, setSWR] = useState()
  const subscribe = async () => {
    setSubscriptionState(2)
    const upstream = await seaClient.get('/v1/subscriptions')
    if (upstream.is_enabled) {
      const serverKey = urlB64ToUint8Array(upstream.applicationServerKey)
      const payload = await SWR.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: serverKey
      })
      const dumped = JSON.stringify(payload)
      const subscribe = await seaClient.post('/v1/subscriptions', dumped)
      setSubscriptionState(3)
    }
    return
  }
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(sw => {
          sw.pushManager.getSubscription().then(subscription => {
            if (subscription === null) {
              setSubscriptionState(1)
            } else {
              setSubscriptionState(3)
            }
          })
          setSWR(sw)
        })
        .catch(err => {
          console.error(err)
        })
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
        subscriptionState={subscriptionState}
        subscriptionButtonMessages={subscriptionMessages}
        subscribe={subscribe}
      />
    )
  })
}
