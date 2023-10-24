import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import MainLayout from './components/layouts/MainLayout'
import RequirePermissions from './components/layouts/RequirePermissions'
// import ClientRegistration from './components/registrations/ClientRegistration'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/_helper/errorFallback/ErrorFallback'
import Loader from './components/loaders/Loader'
import AccountVerification from './pages/accountVerification/AccountVerification'
import Dashboard from './pages/dashboard/Dashboard'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'
import NotFound from './pages/unauthorized/NotFound'
import Unauthorized from './pages/unauthorized/Unauthorized'

const StaffProfile = lazy(() => import('./pages/staffProfile/StaffProfile'))
const Field = lazy(() => import('./pages/field/Field'))
const Center = lazy(() => import('./pages/center/Center'))
const Category = lazy(() => import('./pages/category/Category'))
const Accounts = lazy(() => import('./pages/accountManagement/Accounts'))
const Income = lazy(() => import('./pages/accountManagement/Income'))
const Expense = lazy(() => import('./pages/accountManagement/Expense'))
const IncomeCategories = lazy(() => import('./pages/accountManagement/IncomeCategories'))
const ExpenseCategories = lazy(() => import('./pages/accountManagement/ExpenseCategories'))
const Staffs = lazy(() => import('./pages/staffs/Staffs'))
const StaffRoles = lazy(() => import('./pages/staffs/StaffRoles'))
const StaffPermissions = lazy(() => import('./pages/staffs/StaffPermissions'))
const AppSettings = lazy(() => import('./pages/configurations/AppSettings'))
const ApprovalsConfig = lazy(() => import('./pages/configurations/ApprovalsConfig'))
const CategoriesConfig = lazy(() => import('./pages/configurations/CategoriesConfig'))

export default function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* UnAuthenticate Routes */}
          <Route path="/*" element={<NotFound />} />
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
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Loader />}>
                    <StaffProfile />
                  </Suspense>
                </ErrorBoundary>
              }
            />

            {/* Field, Center, Category */}
            <Route
              path="fields"
              element={<RequirePermissions allowedPermissions={['field_list_view']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <Field />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path="centers"
              element={<RequirePermissions allowedPermissions={['center_list_view']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <Center />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path="categories"
              element={<RequirePermissions allowedPermissions={['category_list_view']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <Category />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>

            {/* Account Management Routes */}
            <Route path="accounts">
              <Route element={<RequirePermissions allowedPermissions={['account_list_view']} />}>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <Accounts />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              {/* Income */}
              <Route path="income">
                <Route element={<RequirePermissions allowedPermissions={['income_list_view']} />}>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <Income />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
                <Route
                  path="categories"
                  element={
                    <RequirePermissions allowedPermissions={['income_category_list_view']} />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <IncomeCategories />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
              </Route>
              {/* Expense */}
              <Route path="expense">
                <Route element={<RequirePermissions allowedPermissions={['expense_list_view']} />}>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <Expense />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
                <Route
                  path="categories"
                  element={
                    <RequirePermissions allowedPermissions={['income_category_list_view']} />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <ExpenseCategories />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
              </Route>
            </Route>

            {/* Staffs */}
            <Route
              path="staffs"
              element={<RequirePermissions allowedPermissions={['staff_list_view']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <Staffs />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path="staff-roles"
              element={<RequirePermissions allowedPermissions={['role_list_view']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <StaffRoles />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path="staff-permissions/:id"
              element={<RequirePermissions allowedPermissions={['staff_registration']} />}>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <StaffPermissions />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>

            {/* App Configurations Routes */}
            <Route path="settings-and-privacy">
              <Route element={<RequirePermissions allowedPermissions={['app_settings']} />}>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <AppSettings />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="approvals"
                element={<RequirePermissions allowedPermissions={['approvals_config']} />}>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <ApprovalsConfig />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="categories-config"
                element={<RequirePermissions allowedPermissions={['categories_config']} />}>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <CategoriesConfig />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
