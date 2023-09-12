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
import Unauthorized from './pages/unauthorized/Unauthorized'

const ClientRegistration = lazy(() => import('./components/registrations/ClientRegistration'))
const Staffs = lazy(() => import('./pages/staffs/Staffs'))
const StaffRoles = lazy(() => import('./pages/staffRoles/StaffRoles'))

export default function App() {
  return (
    <>
      <Routes>
        {/* UnAuthenticate Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
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
                  <Staffs />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="staff-roles"
            element={<RequirePermissions allowedPermissions={['dashboardAsAdmin']} />}>
            <Route
              index
              element={
                <Suspense fallback={<div>Staff Roles is Loading..............</div>}>
                  <StaffRoles />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
