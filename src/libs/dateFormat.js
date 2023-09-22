import { format } from 'date-fns'

export default function dateFormat(value, dateFormat) {
  return format(new Date(value), dateFormat)
}
