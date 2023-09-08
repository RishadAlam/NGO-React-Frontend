import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import MainLayout from './components/layouts/MainLayout'
import RequirePermissions from './components/layouts/RequirePermissions'
// import ClientRegistration from './components/registrations/ClientRegistration'
import AccountVerification from './pages/accountVerification/AccountVerification'
import Dashboard from './pages/dashboard/Dashboard'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'

const ClientRegistration = lazy(() => import('./components/registrations/ClientRegistration'))
const Staff = lazy(() => import('./pages/staff/Staffs'))

export default function App() {
  return (
    <>
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
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="registration"
            element={<RequirePermissions allowedPermissions={['dashboardAsAdmin']} />}>
            <Route
              index
              element={
                <Suspense fallback={<div>ClientRegister is Loading..............</div>}>
                  <ClientRegistration />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="staffs"
            element={<RequirePermissions allowedPermissions={['dashboardAsAdmin']} />}>
            <Route
              index
              element={
                <Suspense fallback={<div>Staff is Loading..............</div>}>
                  <Staff />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
