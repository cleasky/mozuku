import * as React from 'react'
const { forwardRef, useState } = React
import Twemoji from 'react-twemoji'
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker'
import AlbumFile from '../../models/album'

import Config from '../../config'
import Axios from 'axios'

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
  submitAlbum: (e: React.ClipboardEvent) => void
  submitAlbumFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  images: AlbumFile[]
  isUploding: boolean
  uploadStatus: string
  cancelFileFromImages: (fileId: number) => void
}
export default forwardRef<HTMLTextAreaElement, T>(
  (
    {
      draftDisabled,
      submitDraft,
      setDraft,
      draft,
      submitAlbum,
      submitAlbumFromFile,
      images,
      isUploding,
      uploadStatus,
      cancelFileFromImages
    },
    ref
  ) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setEmojiP(false)
      submitDraft()
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
        submitDraft()
      }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.target.value)
    }
    const onPaste = (event: React.ClipboardEvent) => {
      submitAlbum(event)
    }
    const onFileSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      submitAlbumFromFile(e)
    }
    const [emojiP, setEmojiP] = useState(false)
    const [emojiData, setEmojiData] = useState(null as any)
    const setupEmoji = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
      e.preventDefault()
      if (!emojiData) {
        Axios.get('https://unpkg.com/emoji-mart@2.11.1/data/twitter.json').then(
          res => {
            setEmojiData(res.data)
            setEmojiP(true)
          }
        )
      } else {
        setEmojiP(true)
      }
    }

    return (
      <>
        <form className="postForm" onSubmit={onSubmit}>
          <Twemoji>
            <textarea
              className="postForm__textarea"
              disabled={draftDisabled}
              onKeyDown={onKeyDown}
              onChange={onChange}
              onPaste={onPaste}
              ref={ref}
              placeholder="What's up?"
              value={draft}
            />
          </Twemoji>
          <button
            className="postForm__button"
            type="submit"
            disabled={draftDisabled}
          >
            Post
          </button>
        </form>

        <div className="postForm__images-area">
          <label
            onClick={setupEmoji}
            className="postForm__images-area__form__label"
          >
            <Twemoji>😄</Twemoji>
          </label>
          {emojiP ? (
            <>
              <div className="emoji-mart-container">
                <NimblePicker
                  set="twitter"
                  data={emojiData}
                  native={true}
                  sheetSize={16}
                  title=""
                  onClick={(emj: any) => {
                    setDraft(`${draft}${emj.native}`)
                  }}
                />
              </div>
              <div
                className="emoji-mart__wrap"
                onClick={() => {
                  setEmojiP(false)
                }}
              />
            </>
          ) : (
            <></>
          )}
          <form>
            <label
              className="postForm__images-area__form__label"
              htmlFor="fileupload"
            >
              <Twemoji>
                {isUploding ? (
                  <span className="postForm__images-area__form__label_loading">
                    🤔
                  </span>
                ) : (
                  '+'
                )}
              </Twemoji>
              <input
                type="file"
                id="fileupload"
                className="postForm__images-area__form__input"
                onChange={onFileSubmit}
              />
            </label>
          </form>
          <div className="postForm__images-area__collection">
            {images.map(image => (
              <div className="postForm__images-area__collection__item">
                <picture key={image.id}>
                  {image.variants
                    .filter(variant => variant.type == 'thumbnail')
                    .map(variant => (
                      <source
                        key={variant.id}
                        srcSet={variant.url}
                        type={variant.mime}
                      />
                    ))}
                  <img
                    title={image.name}
                    className="postForm__images-area__collection__picture__img"
                  />
                </picture>
                <div
                  onClick={() => cancelFileFromImages(image.id)}
                  className="postForm__images-area__collection__button"
                >
                  x
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="postForm__post-setting__area">
          <label>
            <input
              type="checkbox"
              name="toggle_image_compression"
              className="checkbox"
              defaultChecked={Config.image_compression}
              onChange={() => {
                Config.image_compression = !Config.image_compression
                localStorage.setItem(
                  'Mozukusu::AppPreference::ImageCompression',
                  JSON.stringify(Config.image_compression)
                )
              }}
            />
            画像を圧縮する
          </label>
          {' | '}
          <span>{uploadStatus}</span>
        </div>
      </>
    )
  }
)
