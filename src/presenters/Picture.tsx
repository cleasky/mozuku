import * as React from 'react'
const { useState } = React

import config from '../config'
import AlbumFile from '../models/album'

export default ({
  file,
  setOpenModal
}: {
  file: AlbumFile
  setOpenModal: (s: string | null) => void
}) => {
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const [zoom, setZoom] = useState(false)
  const setXY = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setZoom(true)
    setMoveX(
      100 -
        ((e.clientX - e.currentTarget.offsetLeft + e.currentTarget.width / 2) /
          e.currentTarget.width) *
          100
    )
    setMoveY(
      100 -
        ((e.pageY - e.currentTarget.offsetTop + e.currentTarget.height / 2) /
          e.currentTarget.height) *
          100
    )
  }

  return (
    <picture>
      {file.variants
        .filter(variant => variant.size <= config.image_maxsize)
        .sort((a, b) => b.score - a.score)
        .map(variant => (
          <source key={variant.id} srcSet={variant.url} type={variant.mime} />
        ))}
      <img
        style={{
          transform: `translate(${zoom ? moveX : '0'}%, ${
            zoom ? moveY : '0'
          }%) scale(${zoom ? '2' : '1'})`
        }}
        title={file.name}
        onClick={e => {
          setZoom(false)
          const mime = file.variants.filter(
            variant =>
              e.currentTarget.currentSrc.split('album_files')[1] ==
              variant.url.split('album_files')[1]
          )[0].mime
          const imex = file.variants.filter(
            variant => variant.mime == mime && variant.type == 'image'
          )
          const urlToOpen = imex.length
            ? imex[0].url
            : e.currentTarget.currentSrc
          history.pushState(history.state, file.name, `#image_${file.id}`)
          setOpenModal(urlToOpen)
        }}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={e => setXY(e)}
      />
    </picture>
  )
}
