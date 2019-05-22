import * as React from 'react'

import config from '../config'
import AlbumFile from '../models/album'

export default ({ avatar }: { avatar: AlbumFile }) => {
  const valid = avatar.variants
    .filter(
      variant =>
        variant.size <= config.image_maxsize && variant.type == 'thumbnail'
    )
    .sort((a, b) => b.score - a.score)

  return (
    <picture>
      {valid.map(variant => (
        <source srcSet={variant.url} type={variant.mime} key={variant.id} />
      ))}
      <img title={avatar.name} src={valid[0].url} />
    </picture>
  )
}
