export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}
