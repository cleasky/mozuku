import * as React from 'react'
const { useState } = React
import { Moment } from 'moment'
import Twemoji from 'react-twemoji'
import filesize from 'filesize'

import Config from '../config'
import AlbumFile from '../models/album'
import NameForm from '../containers/Settings/NameForm'
import AvatarForm from '../containers/Settings/AvatarForm'
import verified from '../static/verified.svg'

export default ({
  name,
  screenName,
  createdAt,
  avatar,
  onClickLogout,
  commitState
}: {
  name: string
  screenName: string
  createdAt: Moment
  avatar: AlbumFile | null
  onClickLogout: (e: React.MouseEvent<HTMLButtonElement>) => void
  commitState: any
}) => {
  const [maxSize, setMaxSize] = useState(Config.image_maxsize)

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
      <div className="settings">
        <div className="settingsItem__name">
          <span className="settingsItem__name__name">{name}</span>
          <span className="settingsItem__name__screenName">@{screenName}</span>
        </div>
        <div className="settingsItem__title">Account</div>
        Created at: {createdAt.toLocaleString()}
        <div className="settingsItem__subtitle">Name</div>
        <NameForm name={name} />
        <div className="settingsItem__subtitle">Avatar</div>
        <AvatarForm avatarFile={avatar} />
        <div className="settingsItem__subtitle">Session</div>
        <button className="settingsItem__logout" onClick={onClickLogout}>
          Logout
        </button>
        <div className="settingsItem__title">Client</div>
        <div className="settingsItem__subtitle">Settings</div>
        <form>
          <label className="settingsItem__label">
            <input
              name="toggle_post_sound"
              type="checkbox"
              className="checkbox"
              defaultChecked={Config.post_sound}
              onChange={() => {
                Config.post_sound = !Config.post_sound
                localStorage.setItem(
                  'Mozukusu::AppPreference::PostSound',
                  JSON.stringify(Config.post_sound)
                )
              }}
            />
            音を鳴らす（投稿）
          </label>
        </form>
        <form>
          <label className="settingsItem__label">
            <input
              name="toggle_post_sound_reply"
              type="checkbox"
              className="checkbox"
              defaultChecked={Config.post_sound_reply}
              onChange={() => {
                Config.post_sound_reply = !Config.post_sound_reply
                localStorage.setItem(
                  'Mozukusu::AppPreference::PostSoundReply',
                  JSON.stringify(Config.post_sound_reply)
                )
              }}
            />
            音を鳴らす（リプライ）
          </label>
        </form>
        <form>
          <label className="settingsItem__label">
            <input
              name="toggle_image_compress"
              type="checkbox"
              className="checkbox"
              defaultChecked={Config.image_compression}
              onChange={() => {
                Config.image_compression = !Config.image_compression
                localStorage.setItem(
                  'Mozukusu::AppPreference::ImageCompression',
                  JSON.stringify(Config.image_compression)
                )
              }}
            />
            画像を圧縮する
          </label>
        </form>
        <form>
          <label className="settingsItem__label">
            最大画像サイズ:{' '}
            <input
              name="image_maxsize"
              type="number"
              defaultValue={Config.image_maxsize}
              onChange={e => {
                const inMaxSize = parseInt(e.target.value)
                setMaxSize(inMaxSize)
                Config.image_maxsize = inMaxSize
                localStorage.setItem(
                  'Mozukusu::AppPreference::ImageMaxsize',
                  JSON.stringify(inMaxSize)
                )
              }}
            />
          </label>
        </form>
        <span>= {filesize(maxSize)}</span>
        <div className="settingsItem__subtitle">Info</div>
        <ul>
          <li>
            API:{' '}
            <a href={Config.api} target="_blank" rel="noreferrer">
              {Config.api}
            </a>
          </li>
          <li>
            OAuth:{' '}
            <a href={Config.oauth} target="_blank" rel="noreferrer">
              {Config.oauth}
            </a>
          </li>
          <li>
            Repository:{' '}
            {Config.repository_url ? (
              <a
                href={`https://${Config.repository_url}`}
                target="_blank"
                rel="noreferrer"
              >
                {Config.repository_url}
              </a>
            ) : (
              'unknown'
            )}
          </li>
          <li>Commit: {Config.commit || 'unknown'}</li>
        </ul>
        {Config.commit_fetch_url &&
          (commitState.commit ? (
            <div>
              <ul>
                <li>
                  Latest Commit: {commitState.commit.message}
                  <ul>
                    <li>Hash: {commitState.sha}</li>
                    <li>Author: {commitState.commit.author.name}</li>
                    <li>Commited at: {commitState.commit.author.date}</li>
                  </ul>
                </li>
              </ul>
              Running version:{' '}
              {Config.commit ? (
                Config.commit.split('@')[1] == commitState.sha ? (
                  'up-to-date'
                ) : (
                  <>
                    outdated. <a onClick={() => location.reload()}>refresh?</a>
                  </>
                )
              ) : (
                'unknown'
              )}
            </div>
          ) : (
            'loading commit information...'
          ))}
      </div>
    </Twemoji>
  )
}
