import $ from 'cafy'
import Model from './_model'

export default class Application implements Model {
  id: number
  name: string
  is_automated: boolean

  private validate(app: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      isAutomated: $.bool
    }).throw(app)
  }

  constructor(a: any) {
    const app = this.validate(a)
    this.id = app.id
    this.name = app.name
    this.is_automated = app.isAutomated
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      is_automated: this.is_automated
    }
  }
}
