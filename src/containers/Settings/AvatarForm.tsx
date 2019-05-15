import * as React from 'react'
const { useState } = React

import seaClient from '../../util/seaClient'

import $ from 'cafy'
import appStore from '../../stores/app'
import albumFile from '../../models/album'
import AvatarForm from '../../presenters/Settings/AvatarForm'

export default ({ avatarFile }: { avatarFile: albumFile | null }) => {
  const [avatarDraft, setAvatarDraft] = useState(
    avatarFile ? avatarFile.id : (null as number | null)
  )
  const [avatarDraftDisabled, setAvatarDraftDisabled] = useState(false)
  const [message, setMessage] = useState('')
  const submitAvatarDraft = async () => {
    setAvatarDraftDisabled(true)
    if ($.num.ok(avatarDraft)) {
      try {
        await seaClient.patch('/v1/account', { avatarFileId: avatarDraft })
        setMessage(`Your new avatar: ${avatarDraft}`)
        appStore.updateMyAccount()
      } catch (e) {
        // TODO: Add error reporting
        setMessage('invalid input: maybe file not found?')
        console.error(e)
      }
    } else {
      setMessage('invalid input')
    }
    setAvatarDraftDisabled(false)
  }

  return (
    <AvatarForm
      avatarDraftDisabled={avatarDraftDisabled}
      setAvatarDraft={setAvatarDraft}
      submitAvatarDraft={submitAvatarDraft}
      avatarDraft={avatarDraft}
      message={message}
    />
  )
}
