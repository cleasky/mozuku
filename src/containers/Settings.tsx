import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import Axios from 'axios'

import Config from '../config'
import appStore from '../stores/app'

import Settings from '../presenters/Settings'

export default () => {
  const [commitState, setCommitState] = useState({})
  useEffect(() => {
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
        onClickLogout={e => {
          e.preventDefault()
          appStore.logout()
        }}
        commitState={commitState}
      />
    )
  })
}
