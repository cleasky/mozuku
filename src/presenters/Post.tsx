import * as React from 'react'
const { useState, useEffect } = React
import Twemoji from 'react-twemoji'
import moment from 'moment-timezone'
import filesize from 'filesize'

import OGP from './OGP'
import Picture from './Picture'
import Icon from './Icon'
import Identicon from 'react-identicons'
import verified from '../static/verified.svg'

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'
import config from '../config'
import AlbumFile from '../models/album'

export default ({
  post,
  setModalImage
}: {
  post: Post
  setModalImage: (s: AlbumFile | null) => void
}) => {
  const [nameHidden, setNameHidden] = useState(false)
  const tzTime = moment(post.createdAt).tz('Asia/Tokyo')
  const formattedTime = tzTime.format()
  const [showRelativeTime, setShowRelativeTime] = useState(true)
  const getRelativeTime = () => {
    return tzTime.fromNow(true)
  }
  const [relativeTime, setRelativeTime] = useState(getRelativeTime())
  const [imageSize, setImageSize] = useState(0 as number | null)
  useEffect(() => {
    const element = document.createElement('span')
    const text = document.createTextNode(post.author.name)
    element.style.cssText = 'position:absolute;opacity:0;'
    element.append(text)
    const putElement = document.body.appendChild(element)
    setNameHidden(!putElement.offsetWidth)
    document.body.removeChild(element)

    const timeUpdate = setInterval(() => {
      setRelativeTime(getRelativeTime())
    }, 1000)
    return () => {
      clearInterval(timeUpdate)
    }
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
            <Icon avatar={post.author.avatarFile} />
          ) : (
            <Identicon string={post.author.screenName} size={50} />
          )}
        </div>
        <div className="post-main">
          <div className="post-head">
            <div className="post-head__name">
              <span className="post-head__name__name" hidden={nameHidden}>
                {post.author.name}
              </span>
              <span className="post-head__name__screenName">
                @{post.author.screenName}
              </span>
            </div>
            <div
              className="post-head__time"
              title={formattedTime}
              onClick={() => setShowRelativeTime(!showRelativeTime)}
            >
              {showRelativeTime ? relativeTime : formattedTime}
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
                  <Picture
                    file={file}
                    setModalImage={setModalImage}
                    setImageSize={setImageSize}
                  />
                  <div className="post-image__anon">
                    <p>{imageSize && filesize(imageSize)}</p>
                  </div>
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
      </div>
    </Twemoji>
  )
}
