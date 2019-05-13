import * as React from 'react'
import moment from 'moment-timezone'
import axios from 'axios'
import Config from '../config'
const { useState } = React

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'

export default ({ post }: { post: Post }) => {
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const setXY = (xzoom: number, yzoom: number) => {
    setZoom(true)
    setMoveX(xzoom)
    setMoveY(yzoom)
  }
  const [zoom, setZoom] = useState(false)
  return (
    <div className="post">
      <div className="post__head post-head">
        <div className="post-head__name">
          <span className="post-head__name__name">
            {[].filter
              .call(
                post.author.name.trim(),
                (c: string) => c.charCodeAt(0) !== 8203
              )
              .join('')
              .replace(/[\u200B-\u200D\uFEFF]/g, '')
              .replace(/[\uD800-\uDFFF]{2}/g, '').length
              ? post.author.name
              : `@${post.author.screenName}`}
          </span>
          <span className="post-head__name__screenName">
            @{post.author.screenName}
          </span>
        </div>
        <div className="post-head__time">
          {moment(post.createdAt)
            .tz('Asia/Tokyo')
            .format('HH:mm:ss · D MMM YYYY')}
        </div>
      </div>
      <div className="post__body">
        {post.body.parts.map((p, i) => {
          switch (p.type) {
            case BODYPART_TYPE_LINK:
            case BODYPART_TYPE_LINK_IMAGE:
              return (
                <a key={i} href={p.payload} target="_blank" rel="noreferrer">
                  {decodeURI(p.payload)}
                </a>
              )
            case BODYPART_TYPE_BOLD:
              return (
                <span key={i} className="post__body__bold">
                  {p.payload}
                </span>
              )
            default:
              return <React.Fragment key={i}>{p.payload}</React.Fragment>
          }
        })}
      </div>
      <div className="post__image">
        {post.body.parts.map((p, i) => (
          <React.Fragment key={i}>
            {p.type === BODYPART_TYPE_LINK_IMAGE && (
              <a href={p.payload} target="_blank" rel="noreferrer">
                <div className="post-image__img">
                  <img src={p.payload} />
                </div>
              </a>
            )}
          </React.Fragment>
        ))}
        {post.files.map(file => (
          <React.Fragment key={file.id}>
            <a href={file.variants[0].url} target="_blank" rel="noreferrer">
              <div className="post-image__img">
                <picture>
                  {file.variants.map(variant => (
                    <source
                      key={variant.id}
                      srcSet={variant.url}
                      type={variant.mime}
                    />
                  ))}
                  <img
                    style={{
                      transform: `translate(${zoom ? moveX : '0'}%, ${
                        zoom ? moveY : '0'
                      }%) scale(${zoom ? '2' : '1'})`
                    }}
                    src={file.variants[0].url}
                    title={file.name}
                    onMouseLeave={e => {
                      setZoom(false)
                    }}
                    onMouseMove={e =>
                      setXY(
                        100 -
                          ((e.clientX - e.currentTarget.x) /
                            e.currentTarget.width) *
                            80,

                        100 -
                          ((e.clientY - e.currentTarget.y) /
                            e.currentTarget.height) *
                            80
                      )
                    }
                  />
                </picture>
              </div>
            </a>
          </React.Fragment>
        ))}
      </div>
      <div className="post__meta">via {post.application.name}</div>
    </div>
  )
}
