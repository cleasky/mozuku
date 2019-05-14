import * as React from 'react'
const { useState } = React

import config from '../config'
import { AlbumFile } from '../models/post'

export default ({ file }: { file: AlbumFile }) => {
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
        .filter((variant, index, vrs) => {
          if (vrs.filter(vr => vr.type == 'image').length) {
            return variant.type == 'image'
          } else {
            return variant
          }
        })
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
            variant => variant.url == e.currentTarget.currentSrc
          )[0].mime
          const imex = file.variants.filter(
            variant => variant.mime == mime && variant.type == 'image'
          )
          window.open(
            imex.length ? imex[0].url : e.currentTarget.currentSrc,
            '_blank'
          )
        }}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={e => setXY(e)}
      />
    </picture>
  )
}
