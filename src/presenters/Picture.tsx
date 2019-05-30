import * as React from 'react'
const { useState } = React

import config from '../config'
import AlbumFile, { AlbumFileVariant } from '../models/album'
import { getDiffieHellman } from 'crypto';

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
  const [zoomEnabled, setZoomEnabled] = useState(false)
  const [fullSize, setFullSize] = useState(null as AlbumFileVariant | null)
  const valid = file.variants
    .filter(variant => variant.size <= config.image_maxsize)
    .sort((a, b) => b.score - a.score)
  const onClick = () => {
    setZoom(false)
    if (fullSize) {
      history.pushState(history.state, file.name, `#image_${file.id}`)
      setOpenModal(fullSize.url)
    }
  }
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const showing = file.variants.filter(
      variant => variant.url == e.currentTarget.currentSrc
    )[0]
    const getSupportedFullSize = file.variants
      .filter(
        variant => variant.type == 'image' && variant.mime == showing.mime
      )
      .sort(variant => variant.score)
    const getAllFullSize = file.variants
      .filter(variant => variant.type == 'image')
      .sort(variant => variant.score)
    const getFullSize = getSupportedFullSize.length
      ? getSupportedFullSize[0]
      : getAllFullSize[0]
    setFullSize(getFullSize)
    setImageSize(getFullSize.size)
    if (showing.type != 'thumbnail') {
      setZoomEnabled(true)
    }
  }

  return (
    <picture>
      {valid.map(variant => (
        <source key={variant.id} srcSet={variant.url} type={variant.mime} />
      ))}
      <img
        src={valid.length ? valid[0].url : undefined}
        style={
          zoomEnabled
            ? {
                transform: `translate(${zoom ? moveX : '0'}%, ${
                  zoom ? moveY : '0'
                }%) scale(${zoom ? '2' : '1'})`
              }
            : {}
        }
        title={file.name}
        onClick={onClick}
        onLoad={onLoad}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={e => setXY(e)}
      />
    </picture>
  )
}
