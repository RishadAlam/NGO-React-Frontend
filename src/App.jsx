import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { useAuthDataState, useIsAuthorizedState } from './atoms/authAtoms'
import { useIsLoadingState } from './atoms/loaderAtoms'
import Layout from './components/layout/Layout'
import { GetLocalStorage, GetSessionStorage } from './helper/GetDataFromStorage'
import AccountVerification from './pages/accountVerification/AccountVerification'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'

export default function App() {
  const [authData, setAuthData] = useAuthDataState()
  const [isAutorized, setIsAuthorized] = useIsAuthorizedState()
  const [isLoading, setIsLoading] = useIsLoadingState()

  useEffect(() => {
    if (!isAutorized) {
      const authorizedData = GetSessionStorage('authData') || GetLocalStorage('authData')
      if (authorizedData) {
        setIsAuthorized(true)
        setAuthData(JSON.parse(authorizedData))
      }
    }
    setIsLoading(false)
  }, [])

  // if (isLoading) {
  //   return <div>loading...</div>
  // }

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
      <Routes>
        {/* UnAuthenticate Routes */}
        <Route path="/login" element={<Layout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/forgot-password" element={<Layout />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path="/account-verification" element={<Layout />}>
          <Route index element={<AccountVerification />} />
        </Route>
      </Routes>
    </>
  )
}
