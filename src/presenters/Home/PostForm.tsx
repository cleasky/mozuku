import * as React from 'react'
const { forwardRef, useState } = React
import Twemoji from 'react-twemoji'
import { Picker } from 'emoji-mart'
import { AlbumFile } from '../../models/post'

import Config from '../../config'

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
        {emojiP ? (
          <>
            <Picker
              set="twitter"
              native={true}
              title=""
              onClick={(emj: any) => {
                setDraft(`${draft}${emj.native}`)
              }}
            />
          </>
        ) : (
          <></>
        )}
        <div className="postForm__images-area">
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
                <img title={image.name} />
                <div
                  onClick={() => cancelFileFromImages(image.id)}
                  className="postForm__images-area__collection__button"
                >
                  x
                </div>
              </picture>
            ))}
          </div>
          <Twemoji>
            <span
              className="postForm__emojiP"
              onClick={() => {
                setEmojiP(!emojiP)
              }}
            >
              😄
            </span>
          </Twemoji>
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
