import * as React from 'react'
const { useState } = React

import config from '../config'
import AlbumFile from '../models/album'

export default ({
  file,
  setOpenModal,
  setImageSize
}: {
  file: AlbumFile
  setOpenModal: (s: string | null) => void
  setImageSize: (s: number | null) => void
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
  const valid = file.variants
    .filter(variant => variant.size <= config.image_maxsize)
    .sort((a, b) => b.score - a.score)
  const fullSizes = file.variants.filter(variant => variant.type == 'image')
  const variantFromUrl = (imageUrl: string) => {
    return file.variants.filter(variant => variant.url == imageUrl)[0]
  }
  const onClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setZoom(false)
    const supportedMime = variantFromUrl(e.currentTarget.currentSrc).mime
    const toOpenVariant = fullSizes
      .filter(variant => variant.mime == supportedMime)
      .sort(variant => variant.score)[0]
    history.pushState(history.state, file.name, `#image_${file.id}`)
    setOpenModal(toOpenVariant.url)
  }
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageSize(variantFromUrl(e.currentTarget.currentSrc).size)
  }

  return (
    <picture>
      {valid.map(variant => (
        <source key={variant.id} srcSet={variant.url} type={variant.mime} />
      ))}
      <img
        src={valid.length ? valid[0].url : undefined}
        style={{
          transform: `translate(${zoom ? moveX : '0'}%, ${
            zoom ? moveY : '0'
          }%) scale(${zoom ? '2' : '1'})`
        }}
        title={file.name}
        onClick={onClick}
        onLoad={onLoad}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={e => setXY(e)}
      />
    </picture>
  )
}
