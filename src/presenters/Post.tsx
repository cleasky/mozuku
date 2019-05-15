import * as React from 'react'
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

export default ({
  post,
  setOpenModal
}: {
  post: Post
  setOpenModal: (s: string | null) => void
}) => {
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
      <div className="post">
        <div className="post-icon">
          <Identicon string={post.author.screenName} size={50} />
        </div>
        <div className="post-main">
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
      </div>
    </Twemoji>
  )
}
