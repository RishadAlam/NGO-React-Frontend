import axios from 'axios'
import { create } from 'mutative'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useIsAuthorizedState, useSetAuthDataState } from '../../atoms/authAtoms'
import { useIsLoadingState, useLoadingState } from '../../atoms/loaderAtoms'
import { GetLocalStorage, GetSessionStorage } from '../../helper/GetDataFromStorage'
import useLocalStorage from '../../hooks/useLocalStorage'
import xFetch from '../../utilities/xFetch'
import Loader from '../loaders/Loader'

export default function AuthProvider({ children }) {
  const [isDark, setIsDark] = useLocalStorage('dark')
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
        toast.error(authorizedData?.message || appConfigData?.message)
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
          draftAuthData.status = authorizedData?.status
          draftAuthData.role = authorizedData?.role
          draftAuthData.permissions = authorizedData?.permissions
        })
      )
      setLoading({ ...loading, authorization: false })
    })
  }

  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light'
    const controller = new AbortController()
    if (!isAuthorized) {
      const Token =
        JSON.parse(GetSessionStorage('accessToken')) || JSON.parse(GetLocalStorage('accessToken'))

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

      {isLoading || loading?.authorization ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}>
          <Loader />
        </div>
      ) : (
        children
      )}
    </>
  )
}
