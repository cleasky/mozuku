import * as React from 'react'

export default ({
  avatarDraftDisabled,
  setAvatarDraft,
  submitAvatarDraft,
  avatarDraft,
  message
}: {
  avatarDraftDisabled: boolean
  setAvatarDraft: (t: number) => void
  submitAvatarDraft: () => void
  avatarDraft: number | null
  message: string
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitAvatarDraft()
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarDraft(parseInt(event.target.value))
  }

  return (
    <>
      <form className="nameForm" onSubmit={onSubmit}>
        <input
          type="number"
          className="nameForm__textarea"
          disabled={avatarDraftDisabled}
          onChange={onChange}
          placeholder="Your avatar's albumFile id"
          value={avatarDraft ? avatarDraft : ''}
        />
        <button
          className="nameForm__button"
          type="submit"
          disabled={avatarDraftDisabled}
        >
          Update Avatar
        </button>
      </form>
      {message}
    </>
  )
}
