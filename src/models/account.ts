import $ from 'cafy'
import Model, { validateDate } from './_model'
import AlbumFile from './album'

export default class Account implements Model {
  id: number
  name: string
  screenName: string
  postsCount: number
  avatarFile: AlbumFile | null
  createdAt: Date
  updatedAt: Date

  private validate(user: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      screenName: $.str,
      postsCount: $.num,
      avatarFile: $.nullable.any,
      createdAt: validateDate,
      updatedAt: validateDate
    }).throw(user)
  }

  constructor(u: any) {
    const user = this.validate(u)
    this.id = user.id
    this.name = user.name
    this.screenName = user.screenName
    this.postsCount = user.postsCount
    this.avatarFile = user.avatarFile
    this.createdAt = new Date(user.createdAt)
    this.updatedAt = new Date(user.updatedAt)
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      screenName: this.screenName,
      postsCount: this.postsCount,
      avatarFile: this.avatarFile,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }
}
