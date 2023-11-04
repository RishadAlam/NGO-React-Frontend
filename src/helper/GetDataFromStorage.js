export const GetSessionStorage = (key) => {
  return window.sessionStorage.getItem(key)
}

export const GetLocalStorage = (key) => {
  return window.localStorage.getItem(key)
}

export const setLocalStorage = (key, value) => {
  return window.localStorage.setItem(key, JSON.stringify(value))
}

export const setSessionStorage = (key, value) => {
  return window.sessionStorage.setItem(key, JSON.stringify(value))
}

export const removeLocalStorage = (key) => {
  return window.localStorage.removeItem(key)
}

export const removeSessionStorage = (key) => {
  return window.sessionStorage.removeItem(key)
}
