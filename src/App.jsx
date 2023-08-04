import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainLayout from './components/layout/MainLayout'
import AccountVerification from './pages/accountVerification/AccountVerification'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'

export default function App() {
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

        {/* Authenticate Routes */}
        <Route path="/" element={<MainLayout />}></Route>
      </Routes>
    </>
  )
}
