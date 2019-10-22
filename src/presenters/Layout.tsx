import * as React from 'react'

import { Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'
import Twemoji from 'react-twemoji'

import Config from '../config'

import { Account } from '../models'

import Home from './Home'
import Me from '../containers/Me'
import Settings from '../containers/Settings'
import NotFound from './NotFound'

import logo from '../static/logo.png'

export default ({ me }: { me?: Account }) => {
  return (
    <div className="mozuku-layout">
      <div className="mozuku-header-wrapper">
        <div className="mozuku-header">
          <h1 className="mozuku-header__logo">
            <Link to={{ pathname: '/' }}>
              <img src={logo} width="64" height="64" alt="Mozuku" />
            </Link>
          </h1>
          <div>
            {me ? (
              <>@{me.screenName}</>
            ) : (
              <span>
                <i>[誰?]</i>
              </span>
            )}
          </div>
          <div>
            <Twemoji>
              <Link to={{ pathname: '/settings' }}>
                <button>⚙</button>
              </Link>
            </Twemoji>
          </div>
        </div>
      </div>

      <div className="mozuku-container">
        {!Config.notice_hidden && (
          <div style={{ padding: '2em', backgroundColor: '#ff9800' }}>
            mozukusu 強推奨利的 &nbsp;
            <a href="https://mozuku.otofune.net">mozuku.otofune.net</a>
            &nbsp;&nbsp;
            <a
              href="#"
              onClick={() => {
                Config.notice_hidden = true
                localStorage.setItem(
                  'Mozukusu::AppPreference::NoticeHidden',
                  JSON.stringify(true)
                )
              }}
            >
              {' '}
              delete this notice
            </a>
          </div>
        )}

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/me" component={Me} />
          <Route exact path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}
