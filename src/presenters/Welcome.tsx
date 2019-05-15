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
          <button
            className="mozuku-welcome__button"
            onClick={() => window.location.replace(authURL)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
