export const GetSessionStorage = (key) => {
  return window.sessionStorage.getItem(key)
}

export const GetLocalStorage = (key) => {
  return window.localStorage.getItem(key)
}
