import $ from 'cafy'
import Model from './_model'

export class AlbumFileVariant {
  extension: string
  id: number
  mime: string
  score: number
  size: number
  type: string
  url: string

  private validate(filevariant: any) {
    return $.obj({
      extension: $.string,
      id: $.num,
      mime: $.str,
      score: $.num,
      size: $.num,
      type: $.str,
      url: $.str
    }).throw(filevariant)
  }

  constructor(f: any) {
    const filevariant = this.validate(f)

    this.extension = filevariant.extension
    this.id = filevariant.id
    this.mime = filevariant.mime
    this.score = filevariant.score
    this.size = filevariant.size
    this.type = filevariant.type
    this.url = filevariant.url
  }

  unpack() {
    return {
      extension: this.extension,
      id: this.id,
      mime: this.mime,
      score: this.score,
      size: this.size,
      type: this.type,
      url: this.url
    }
  }
}

export default class AlbumFile implements Model {
  id: number
  name: string
  variants: AlbumFileVariant[]

  private validate(file: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      variants: $.any
    }).throw(file)
  }

  constructor(f: any) {
    const file = this.validate(f)

    this.id = file.id
    this.name = file.name
    this.variants = file.variants
      .map((filevariant: any) => new AlbumFileVariant(filevariant))
      .sort((filevariant: any) => filevariant.score)
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      variants: this.variants
    }
  }
}
