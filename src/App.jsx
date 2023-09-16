import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import MainLayout from './components/layouts/MainLayout'
import RequirePermissions from './components/layouts/RequirePermissions'
// import ClientRegistration from './components/registrations/ClientRegistration'
import Loader from './components/loaders/Loader'
import AccountVerification from './pages/accountVerification/AccountVerification'
import Dashboard from './pages/dashboard/Dashboard'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'
import Unauthorized from './pages/unauthorized/Unauthorized'

const StaffProfile = lazy(() => import('./pages/staffProfile/StaffProfile'))
const Staffs = lazy(() => import('./pages/staffs/Staffs'))
const StaffRoles = lazy(() => import('./pages/staffs/StaffRoles'))

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
            path="profile"
            element={<RequirePermissions allowedPermissions={['dashboardAsAdmin']} />}>
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <StaffProfile />
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
                <Suspense fallback={<Loader />}>
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
                <Suspense fallback={<Loader />}>
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
