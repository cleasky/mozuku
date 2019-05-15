import * as React from 'react'
const { useState, useRef } = React
const Ahdin = require('ahdin')

import seaClient from '../../util/seaClient'
import { useShortcut } from '../../stores/app'

import axios from 'axios'
import Config from '../../config'
import PostForm from '../../presenters/Home/PostForm'
import AlbumFile from '../../models/album'

export default () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // 110 = n
  useShortcut(110, ev => {
    const el = textareaRef.current!
    if (el.isEqualNode(document.activeElement)) return
    ev.preventDefault()
    textareaRef.current!.focus()
  })

  const [draft, setDraft] = useState('')
  const [draftDisabled, setDraftDisabled] = useState(false)
  const [images, setImages] = useState([] as AlbumFile[])
  const [isUploading, setIsUploading] = useState(false)
  const submitDraft = async () => {
    setDraftDisabled(true)
    setUploadStatus('投稿を送信しています…。')
    if (draft.trim().length > 0 || images.length >= 1) {
      try {
        await seaClient.post('/v1/posts', {
          text: draft,
          fileIds: images.map(image => image.id)
        })
        setDraft('')
        setImages([])
        setUploadStatus('送信に成功しました。')
      } catch (e) {
        // TODO: Add error reporting
        console.error(e)
        setUploadStatus('送信に失敗しました…。')
      }
    }
    setDraftDisabled(false)
  }
  const fileUploader = (file: File) => {
    if (isUploading) return
    setIsUploading(true)
    setUploadStatus('画像を準備しています…')
    new Promise((resolve, reject) => {
      if (Config.image_compression) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result != null) {
            const blob = new Blob([new Uint8Array(reader.result)])
            Ahdin.compress(blob)
              .then(comp => {
                resolve(new File([comp], file.name))
              })
              .catch(err => {
                console.error(err)
                resolve(file)
              })
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        resolve(file)
      }
    }).then(uploadTarget => {
      const form = new FormData()
      form.append('file', uploadTarget)
      form.append('name', uploadTarget.name)
      form.append('ifNameConflicted', 'add-date-string')
      setUploadStatus('画像をアップロードしています…')
      seaClient
        .post('/v1/album/files', form)
        .then(file => {
          setImages(images => [...images, file])
          setIsUploading(false)
          setUploadStatus(
            `画像のアップロードに成功しました: ${file.name} (${file.id})`
          )
        })
        .catch(err => {
          console.error(err)
          setIsUploading(false)
          setUploadStatus('画像のアップロードに失敗しました…。')
        })
    })
  }
  const submitAlbum = async (event: React.ClipboardEvent) => {
    if (event.clipboardData.getData('Text').includes('https://gyazo.com')) {
      event.preventDefault()
      axios
        .get('https://gyazo.now.sh/info', {
          params: {
            url: event.clipboardData.getData('Text').trim()
          }
        })
        .then(resp => {
          setDraft(`${draft} ${resp.data.url}`)
        })
    }
    Array.from(event.clipboardData.files)
      .filter(file => file.type.split('/')[0] == 'image')
      .forEach(file => {
        fileUploader(file)
      })
  }
  const submitAlbumFromFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files != null) {
      Array.from(event.target.files).forEach(file => fileUploader(file))
    }
  }
  const [uploadStatus, setUploadStatus] = useState(
    'Tips: テキストエリアへ入力中のCtrl-Vでも画像を添付できます。'
  )
  const cancelFileFromImagees = (fileId: number) => {
    setImages(images.filter(image => image.id != fileId))
  }

  return (
    <PostForm
      ref={textareaRef}
      draft={draft}
      setDraft={setDraft}
      draftDisabled={draftDisabled}
      submitDraft={submitDraft}
      submitAlbum={submitAlbum}
      submitAlbumFromFile={submitAlbumFromFile}
      images={images}
      isUploding={isUploading}
      uploadStatus={uploadStatus}
      cancelFileFromImages={cancelFileFromImagees}
    />
  )
}
