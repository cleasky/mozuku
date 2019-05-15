import * as React from 'react'
const { useState, useEffect } = React
import Twemoji from 'react-twemoji'
import moment from 'moment-timezone'

import OGP from './OGP'
import Picture from './Picture'
import Identicon from 'react-identicons'
import verified from '../static/verified.svg'

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'
import config from '../config'

export default ({
  post,
  setOpenModal
}: {
  post: Post
  setOpenModal: (s: string | null) => void
}) => {
  const [nameHidden, setNameHidden] = useState(true)
  useEffect(() => {
    console.log('putted!')
    const element = document.createElement('span')
    const text = document.createTextNode(post.author.name)
    element.style.cssText = 'position:absolute;opacity:0;'
    element.append(text)
    const putElement = document.body.appendChild(element)
    setNameHidden(!putElement.offsetWidth)
  }, [])
  return (
    <Twemoji
      options={{
        callback: (iconId: number, options: any, variant: any) => {
          if (iconId == 2714) {
            return verified
          } else {
            return `${options.base}${options.size}/${iconId}${options.ext}`
          }
        }
      }}
    >
      <div id="namecheck" />
      <div className="post">
        <div className="post-icon">
          {post.author.avatarFile ? (
            <picture>
              {post.author.avatarFile.variants
                .filter(
                  variant =>
                    variant.size <= config.image_maxsize &&
                    variant.type == 'thumbnail'
                )
                .sort((a, b) => b.score - a.score)
                .map(variant => (
                  <source
                    srcSet={variant.url}
                    type={variant.mime}
                    key={variant.id}
                  />
                ))}
              <img title={post.author.avatarFile.name} />
            </picture>
          ) : (
            <Identicon string={post.author.screenName} size={50} />
          )}
        </div>
        <div className="post-main">
          <div className="post__head post-head">
            <div className="post-head__name">
              <span className="post-head__name__name" hidden={nameHidden}>
                {post.author.name}
              </span>
              <span className="post-head__name__screenName">
                @{post.author.screenName}
              </span>
            </div>
            <div className="post-head__time">
              {moment(post.createdAt)
                .tz('Asia/Tokyo')
                .format('HH:mm:ss・MM/DD')}
            </div>
          </div>
          <div className="post__body">
            {post.body.parts.map((p, i) => {
              switch (p.type) {
                case BODYPART_TYPE_LINK:
                case BODYPART_TYPE_LINK_IMAGE:
                  return (
                    <a
                      key={i}
                      href={p.payload}
                      target="_blank"
                      rel="noreferrer"
                    >
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
          <div className="post__meta">
            via {post.application.name} ({post.application.id})
          </div>
        </div>
        {post.body.parts
          .filter(p => p.type == BODYPART_TYPE_LINK)
          .map((p, i) => (
            <React.Fragment key={i}>
              <OGP link={p.payload} />
            </React.Fragment>
          ))}
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
              <div className="post-image__img">
                <Picture file={file} setOpenModal={setOpenModal} />
              </div>
            </React.Fragment>
          ))}
        </div>
        {post.files.length >= 1 && (
          <div className="post-files__info">
            {post.files.length} attachments
          </div>
        )}
      </div>
    </Twemoji>
  )
}
