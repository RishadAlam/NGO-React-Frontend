import axios from 'axios'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import Cookies from 'js-cookie'
import { create } from 'mutative'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { initReactI18next } from 'react-i18next'
import { useIsAuthorizedState, useSetAuthDataState } from '../../atoms/authAtoms'
import { useIsLoadingState, useLoadingState } from '../../atoms/loaderAtoms'
import { GetSessionStorage } from '../../helper/GetDataFromStorage'
import xFetch from '../../utilities/xFetch'
import Loader from '../loaders/Loader'

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
    // react: { useSuspence: false }
  })

export default function AuthProvider({ children }) {
  const setAuthData = useSetAuthDataState()
  const [isAuthorized, setIsAuthorized] = useIsAuthorizedState()
  const [isLoading, setIsLoading] = useIsLoadingState()
  const [loading, setLoading] = useLoadingState()

  const authFetch = (Token, signal) => {
    setLoading({ ...loading, authorization: true })
    const accessToken = `Bearer ${Token}`
    const authorizedData = xFetch('authorization', null, signal, accessToken)
    const appConfigData = xFetch('app-config', null, signal, accessToken)

    axios.all([authorizedData, appConfigData]).then((Response) => {
      const authorizedData = Response[0]
      const appConfigData = Response[1]

      if (!authorizedData?.success || !appConfigData?.success) {
        toast.error(!authorizedData?.success ? authorizedData?.message : appConfigData?.message)
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
      setLoading({ ...loading, authorization: false })
    })
  }

  useEffect(() => {
    const lang = Cookies.get('i18next')
    const darkMood = Cookies.get('isDark')
    document.querySelector('html').lang = lang ? lang : 'en'
    document.body.className = darkMood ? (JSON.parse(darkMood) ? 'dark' : 'light') : 'light'
    const controller = new AbortController()

    if (!isAuthorized) {
      const Token = JSON.parse(GetSessionStorage('accessToken')) || Cookies.get('accessToken')

      if (Token) {
        const signal = controller.signal
        authFetch(Token, signal)
      }
    }
    setIsLoading(false)

    return () => {
      controller.abort()
    }
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
