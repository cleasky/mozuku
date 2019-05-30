import $ from 'cafy'
import { isValid } from 'date-fns'

export default interface Model {
  id: number
  unpack(): any
}

export const validateDate = $.str.pipe(i => isValid(new Date(i)))
