import { useEffect } from 'react'

import { observable, computed, action } from 'mobx'

import seaClient from '../util/seaClient'
const KEYS = Object.freeze({
  SEA_CLIENT_PACK: 'mozuku::seaClientState',
  SAPP_CACHE_BROKEN: 'mozuku::stores::App'
})

import {
  Account,
  Post,
  BODYPART_TYPE_BOLD,
  BODYPART_TYPE_TEXT
} from '../models'
import { PostBodyPart } from '../models/post'
import Config from '../config'

export type ShortcutFn = (ev: KeyboardEvent) => void

import messageSound from '../static/decision22.mp3'

class SApp {
  readonly defaultTitle = 'Mozuku'

  @observable hidden = document.hidden
  private setHidden(hidden: boolean) {
    this.hidden = hidden
    this.hiddenListener.forEach(fn => fn(hidden))
  }
  private hiddenListener: ((h: boolean) => void)[] = []
  subscribeHiddenChange(callback: (h: boolean) => void) {
    // TODO: あとで unsubscribe いるかも
    this.hiddenListener.push(callback)
  }

  @observable loggedIn: boolean = false
  @observable initialized: boolean = false

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()

  @observable meId!: number
  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }
  private shortcuts: Map<number, ShortcutFn> = new Map()
  addShortcut(charCode: number, callback: ShortcutFn) {
    // 複数 callback 同じキーに設定しない (atarimae)
    // TODO: 同時に押していい感じに！ってキーバインディングしたいかもしれないのであとでやる かも
    this.shortcuts.set(charCode, callback)
  }
  removeShortcut(charCode: number) {
    this.shortcuts.delete(charCode)
  }

  constructor() {
    const ss = localStorage.getItem(KEYS.SEA_CLIENT_PACK)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
    localStorage.removeItem(KEYS.SAPP_CACHE_BROKEN)

    window.addEventListener('visibilitychange', () => {
      this.setHidden(document.hidden)
    })
    window.document.addEventListener('keypress', ev => {
      if (this.shortcuts.has(ev.charCode)) {
        this.shortcuts.get(ev.charCode)!(ev)
      }
    })
  }
  @action
  login() {
    const p = seaClient.pack()
    localStorage.setItem(KEYS.SEA_CLIENT_PACK, p)
    this.loggedIn = true
  }
  @action
  logout() {
    seaClient.clear()
    localStorage.removeItem(KEYS.SEA_CLIENT_PACK)
    this.loggedIn = false
  }

  async init() {
    try {
      const me = await seaClient
        .get('/v1/account')
        .then((d: any) => new Account(d))
      this.accounts.set(me.id, me)
      this.meId = me.id
      this.initialized = true
    } catch (e) {
      alert('Check sea. You will be logged-out.')
      console.error(e)
      this.logout()
    }
  }

  async updateMyAccount() {
    const me = await seaClient
      .get('/v1/account')
      .then((d: any) => new Account(d))
    this.accounts.set(this.meId, me)
  }

  async applyToPosts(ps: any[]) {
    // Make bold me
    const boldMyScreenNameMiddleware = (a: Account) => (
      p: PostBodyPart
    ): PostBodyPart[] => {
      if (p.type !== BODYPART_TYPE_TEXT) {
        return [p]
      }
      const { screenName } = a
      const r = p.payload.split(new RegExp(/(@[A-Za-z0-9]+)[^A-Za-z0-9]*?/g))
      return r.map(t => {
        if (t.includes(`@${screenName}`)) {
          if (Config.post_sound_reply) {
            try {
              new Audio(messageSound).play()
            } catch (error) {
              console.error(error)
            }
          }
          return {
            type: BODYPART_TYPE_BOLD,
            payload: t
          }
        }
        return {
          type: BODYPART_TYPE_TEXT,
          payload: t
        }
      })
    }

    // cast to post
    const pms = await Promise.all(ps.map(async (p: any) => new Post(p)))
    // custom process for domain
    const posts = await Promise.all(
      pms.map(post => {
        // model に閉じれない物をここにおきます
        if (!this.me) return post // ほとんどの場合ありえない (呼び出しタイミングを考えると)
        post.body.process([boldMyScreenNameMiddleware(this.me)])
        return post
      })
    )
    posts.forEach(p => {
      this.posts.set(p.id, p)
    })
    return posts
  }
}

const app = new SApp()
export default app

export const useShortcut = (charCode: number, callback: ShortcutFn) => {
  // custom react hook for shortcut
  useEffect(() => {
    app.addShortcut(charCode, callback)
    return () => {
      app.removeShortcut(charCode)
    }
  }, [])
}
