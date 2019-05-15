import * as React from 'react'

import { Link } from 'react-router-dom'
import Twemoji from 'react-twemoji'

import Config from '../config'

import logo from '../static/logo.png'

export default ({ authURL }: { authURL: string }) => {
  const url = new URL(Config.api)
  return (
    <div className="mozuku-layout">
      <div className="mozuku-header-wrapper">
        <div className="mozuku-header">
          <h1 className="mozuku-header__logo">
            <Link to={{ pathname: '/' }}>
              <img src={logo} width="64" height="64" alt="Mozuku" />
            </Link>
          </h1>
        </div>
      </div>

      <div className="mozuku-container">
        <div className="mozuku-welcome__space">
          <div className="mozuku-welcome__title">Mozuku</div>
          <p>
            You need to log in to <a href={url.origin}>{url.host}</a> before
            logging into here.
          </p>
          {Config.commit && (
            <>
              <div className="mozuku-welcome__subtitle">Info</div>
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
            </>
          )}
          <a href={authURL}>
            <button className="mozuku-welcome__button">Login</button>
          </a>
        </div>
      </div>
    </div>
  )
}
