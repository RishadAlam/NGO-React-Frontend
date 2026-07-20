import axios from 'axios'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import Cookies from 'js-cookie'
import { create } from 'mutative'
import { useEffect } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { Toaster, toast } from 'react-hot-toast'
import { initReactI18next } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSetAppApprovalConfigsState } from '../../atoms/appApprovalConfigAtoms'
import { useSetAppSettingsState } from '../../atoms/appSettingsAtoms'
import { useIsAuthorizedState, useSetAuthDataState } from '../../atoms/authAtoms'
import { useIsLoadingState, useLoadingState } from '../../atoms/loaderAtoms'
import { GetSessionStorage, removeSessionStorage } from '../../helper/GetDataFromStorage'
import {
  applyThemePalette,
  DEFAULT_THEME_PALETTE,
  THEME_PALETTE_COOKIE
} from '../../resources/staticData/themePalettes'
import xFetch from '../../utilities/xFetch'
import Loader from '../loaders/Loader'

let authBootstrapRequest = null
let authBootstrapAccessToken = null

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'bn'],
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: [
        'cookie',
        'querystring',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain'
      ],
      caches: ['cookie', 'localStorage'],
      cookieMinutes: 43200
    },
    backend: {
      loadPath: '/lang/{{lng}}/translations.json'
    }
  })

export default function AuthProvider({ children }) {
  const { showBoundary } = useErrorBoundary()
  const setAuthData = useSetAuthDataState()
  const setAppSettings = useSetAppSettingsState()
  const setAppApprovalConfigs = useSetAppApprovalConfigsState()
  const [isAuthorized, setIsAuthorized] = useIsAuthorizedState()
  const [isLoading, setIsLoading] = useIsLoadingState()
  const [loading, setLoading] = useLoadingState()
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true
    const lang = Cookies.get('i18next')
    const darkMood = Cookies.get('isDark')
    const paletteId = Cookies.get(THEME_PALETTE_COOKIE) || DEFAULT_THEME_PALETTE
    document.querySelector('html').lang = lang ? lang : 'en'
    const mode = darkMood ? (JSON.parse(darkMood) ? 'dark' : 'light') : 'light'
    document.body.className = mode
    Cookies.set(THEME_PALETTE_COOKIE, paletteId, { expires: 30 })
    applyThemePalette(paletteId, mode)

    if (!isAuthorized) {
      const Token = JSON.parse(GetSessionStorage('accessToken')) || Cookies.get('accessToken')

      if (Token) {
        authFetch(
          Token,
          setIsAuthorized,
          setAuthData,
          setAppSettings,
          setAppApprovalConfigs,
          setLoading,
          showBoundary,
          navigate,
          setIsLoading,
          () => isActive
        )
      }
    }
    setIsLoading(false)

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff'
          }
        }}
      />

      {isLoading || loading?.authorization ? <Loader /> : children}
    </>
  )
}

const authFetch = (
  Token,
  setIsAuthorized,
  setAuthData,
  setAppSettings,
  setAppApprovalConfigs,
  setLoading,
  showBoundary,
  navigate,
  setIsLoading,
  isActive
) => {
  setLoading((currentLoading) => ({ ...currentLoading, authorization: true }))
  const { request, accessToken } = getAuthBootstrapRequest(Token)

  return request
    .then((Response) => {
      if (!isActive()) return

      setLoading((currentLoading) => ({ ...currentLoading, authorization: false }))
      const authorizedData = Response[0]
      const appSettingsData = Response[1]
      const appApprovalConfigData = Response[2]

      if (
        !authorizedData?.success ||
        !appSettingsData?.success ||
        !appApprovalConfigData?.success
      ) {
        toast.error(
          !authorizedData?.success
            ? authorizedData?.message
            : !appSettingsData?.success
              ? appSettingsData?.message
              : appApprovalConfigData?.message
        )
        return
      }

      toast.success(authorizedData?.message)
      setIsAuthorized(true)
      setAuthData((prevAuthData) =>
        create(prevAuthData, (draftAuthData) => {
          draftAuthData.accessToken = accessToken
          draftAuthData.id = authorizedData?.id
          draftAuthData.name = authorizedData?.name
          draftAuthData.email = authorizedData?.email
          draftAuthData.email_verified_at = authorizedData?.email_verified_at ? true : false
          draftAuthData.phone = authorizedData?.phone
          draftAuthData.image = authorizedData?.image
          draftAuthData.image_uri = authorizedData?.image_uri
          draftAuthData.status = authorizedData?.status
          draftAuthData.role = authorizedData?.role
          draftAuthData.permissions = authorizedData?.permissions
        })
      )
      setAppSettings(appSettingsData?.data)
      const approvals = {}
      Array.isArray(appApprovalConfigData?.data) &&
        appApprovalConfigData?.data.forEach((approval) => {
          approvals[approval.meta_key] = approval.meta_value
        })
      setAppApprovalConfigs(approvals)
    })
    .catch((error) => {
      if (!isActive()) return

      if (error?.message) {
        if (error.message === 'Unauthenticated.' || error.status === 401) {
          removeSessionStorage('accessToken')
          Cookies.remove('accessToken')
          setIsAuthorized(false)
          setLoading((currentLoading) => ({ ...currentLoading, authorization: false }))
          setIsLoading(false)
          navigate('login')
          return
        }

        showBoundary(error?.message)
      }
    })
}

const getAuthBootstrapRequest = (Token) => {
  const accessToken = `Bearer ${Token}`

  if (!authBootstrapRequest || authBootstrapAccessToken !== accessToken) {
    authBootstrapAccessToken = accessToken
    const authorizedData = xFetch('authorization', null, null, accessToken)
    const appSettingsData = xFetch('app-settings', null, null, accessToken)
    const appApprovalConfigData = xFetch('approvals-config', null, null, accessToken)

    const currentRequest = axios.all([
      authorizedData,
      appSettingsData,
      appApprovalConfigData
    ])

    const sharedRequest = currentRequest.finally(() => {
      if (authBootstrapRequest === sharedRequest) {
        authBootstrapRequest = null
        authBootstrapAccessToken = null
      }
    })
    authBootstrapRequest = sharedRequest
  }

  return { request: authBootstrapRequest, accessToken }
}
