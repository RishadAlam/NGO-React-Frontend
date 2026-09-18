const storageKey = 'ngo.impersonation'
export const sessionNavigationEvent = 'ngo:session-navigation'

export function getImpersonationSession() {
  try {
    const session = JSON.parse(window.sessionStorage.getItem(storageKey))
    if (session && typeof session.accessToken === 'string' && Number.isFinite(session.expiresAt))
      return session
  } catch (_error) {
    // A malformed or unavailable browser store must never create a session.
  }
  return null
}

export function saveImpersonationSession(response) {
  const remaining = Number(response?.impersonation?.remaining_seconds)
  if (!response?.access_token || !Number.isFinite(remaining) || remaining <= 0) {
    throw new Error('The temporary session could not be started. Please try again.')
  }
  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      name: response.name || '',
      accessToken: response.access_token,
      expiresAt: Date.now() + Math.min(900, remaining) * 1000
    })
  )
}

export function navigateSession(path) {
  // The auth provider unloads the app, discarding cached data and open forms.
  window.dispatchEvent(new CustomEvent(sessionNavigationEvent, { detail: path }))
}

export function returnToOwnAccount() {
  window.sessionStorage.removeItem(storageKey)
  navigateSession('/staffs')
}

export function isImpersonationRead(endpoint, method = 'GET', data = null) {
  const path = String(endpoint)
    .split(/[?#]/, 1)[0]
    .replace(/^\/+|\/+$/g, '')
  const requestedMethod = method.toUpperCase()
  const override = data instanceof FormData ? data.get('_method') : data?._method
  const verb =
    requestedMethod === 'POST' ? String(override || requestedMethod).toUpperCase() : requestedMethod
  if (verb === 'POST') {
    return (
      ['impersonation/stop', 'logout'].includes(path) ||
      /^categories-config\/element\/[^/]+$/.test(path)
    )
  }
  return (
    ['GET', 'HEAD'].includes(verb) &&
    !/^(transactions\/approve-transactions\/|otp-resend\/)/.test(path) &&
    !['cache-clear', 'config-clear', 'route-clear', 'optimize-clear', 'storage-link'].includes(path)
  )
}
