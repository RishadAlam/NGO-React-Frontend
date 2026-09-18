import axios from 'axios'
import Cookies from 'js-cookie'
import i18n from 'i18next'
import { toast } from 'react-hot-toast'
import { getRecoil } from 'recoil-nexus'
import { authDataState } from '../atoms/authAtoms'
import { resolveMobileMutationPermissions } from '../helper/mobileMutationPermissions'
import {
  getImpersonationSession,
  isImpersonationRead,
  returnToOwnAccount
} from '../helper/impersonationSession'

export default async function xFetch(
  endpoint,
  data,
  signal = null,
  accessToken = null,
  queryParam = null,
  method = 'GET',
  multipart = false,
  permissionContext = {}
) {
  let currentAuth
  try {
    currentAuth = getRecoil(authDataState)
  } catch (_error) {
    /* Auth bootstrap has no snapshot yet. */
  }
  const temporarySession = getImpersonationSession()
  if (currentAuth?.impersonation || temporarySession) {
    const expectedToken = temporarySession
      ? `Bearer ${temporarySession.accessToken}`
      : currentAuth?.accessToken
    if (temporarySession && temporarySession.expiresAt <= Date.now()) {
      returnToOwnAccount()
      return Promise.reject({ status: 401, code: 'IMPERSONATION_ENDED' })
    }
    if (
      (accessToken && accessToken !== expectedToken) ||
      !isImpersonationRead(endpoint, method, data)
    ) {
      const message = i18n.isInitialized
        ? i18n.t('impersonation.read_only')
        : 'This session is view only. Return to your account to make changes.'
      toast.error(message)
      return Promise.reject({
        status: 403,
        success: false,
        code: 'IMPERSONATION_READ_ONLY',
        message
      })
    }
  }
  const uri = new URL(`/api/${endpoint}`, import.meta.env.VITE_BASE_URI)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  // Build Config
  const config = {
    method: method.toUpperCase(),
    url: uri,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': Cookies.get('i18next') || 'en'
    }
  }

  // Let the user retry returning even when the connection never responds.
  if (
    (currentAuth?.impersonation || temporarySession) &&
    ['impersonation/stop', 'logout'].includes(endpoint)
  ) {
    config.timeout = 10000
  }

  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
    config.data = data instanceof FormData ? data : JSON.stringify(data)
  }
  if (accessToken) {
    config.headers.Authorization = accessToken
  }
  if (multipart) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }

  // AbortController Signal
  if (signal) {
    config.signal = signal
  }

  // Read the current session immediately before dispatch, not the session that
  // opened a form or a delayed password/deletion confirmation.
  if (window.matchMedia('(max-width:767.98px)').matches) {
    const required = resolveMobileMutationPermissions(endpoint, data, method, permissionContext)
    if (required !== null) {
      let auth
      try {
        auth = getRecoil(authDataState)
      } catch (_error) {
        // No current auth snapshot is not authorization to mutate.
      }
      if (
        !required.length ||
        !Array.isArray(auth?.permissions) ||
        !required.every((permission) => auth.permissions.includes(permission)) ||
        !auth.accessToken ||
        auth.accessToken !== accessToken
      ) {
        return Promise.reject({
          status: 403,
          success: false,
          message: i18n.isInitialized
            ? i18n.t('common_validation.unauthorized_action')
            : 'This action is unauthorized.'
        })
      }
    }
  }

  const response = await axios(config)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((errors) => {
      const mobileLogin = endpoint === 'login' && window.matchMedia('(max-width:767.98px)').matches
      const safeLoginMessage = i18n.isInitialized
        ? i18n.t('localization.shared.unexpected_error')
        : 'Something went wrong. Please try again.'
      if (errors.response) {
        if (temporarySession && errors.response.status === 401) {
          returnToOwnAccount()
          return Promise.reject({
            ...errors.response.data,
            status: 401,
            code: 'IMPERSONATION_ENDED'
          })
        }
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(errors.response.data)
        // console.log(errors.response.status)
        // console.log(errors.response.headers)
        toast.error(
          mobileLogin && errors.response.status >= 500
            ? safeLoginMessage
            : errors.response.data.message
        )
        errors.response.data['status'] = errors.response.status
        // return errors.response.data
        return Promise.reject(errors.response.data)
      } else if (errors.request) {
        // The request was made but no response was received
        // `errors.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        toast.error(
          i18n.isInitialized ? i18n.t('common_validation.network_error') : 'Something went wrong!'
        )
        // return errors.request
        return Promise.reject(errors.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', errors.message)
        // return { success: false, errors: { message: errors.message } }
        return Promise.reject({
          success: false,
          errors: { message: mobileLogin ? safeLoginMessage : errors.message }
        })
      }
    })

  return response
}
