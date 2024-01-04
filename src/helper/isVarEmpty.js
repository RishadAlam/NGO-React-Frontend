import { isEmptyArray, isEmptyObject } from './isEmptyObject'

export const isVarEmpty = (data) => {
  // check if null or undefined or empty string
  if (data === null || data === undefined || data === '') return true
  // check if array or object and empty
  if (isEmptyArray(data)) return true
  if (isEmptyObject(data)) return true
  return false
}
