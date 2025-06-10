import { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import { useAppSettingsValue } from './atoms/appSettingsAtoms'
import ErrorFallback from './components/_helper/errorFallback/ErrorFallback'
import Layout from './components/layouts/Layout'
import MainLayout from './components/layouts/MainLayout'
import RequirePermissions from './components/layouts/RequirePermissions'
import Loader from './components/loaders/Loader'
import AccountVerification from './pages/accountVerification/AccountVerification'
import Dashboard from './pages/dashboard/Dashboard'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import Login from './pages/login/Login'
import NotFound from './pages/unauthorized/NotFound'
import Unauthorized from './pages/unauthorized/Unauthorized'

const StaffProfile = lazy(() => import('./pages/staffProfile/StaffProfile'))
const ClientRegistration = lazy(() => import('./pages/registration/ClientRegistration'))
const SavingAccReg = lazy(() => import('./pages/registration/SavingAccReg'))
const LoanAccReg = lazy(() => import('./pages/registration/LoanAccReg'))
const PendingClientReg = lazy(() => import('./pages/pendingRegistrations/PendingClientReg'))
const PendingSavingReg = lazy(() => import('./pages/pendingRegistrations/PendingSavingReg'))
const PendingLoanReg = lazy(() => import('./pages/pendingRegistrations/PendingLoanReg'))
const PendingLoans = lazy(() => import('./pages/pendingLoans/PendingLoans'))
const SavingReport = lazy(() => import('./pages/regularCollection/SavingReport'))
const SavingReportSheet = lazy(() => import('./pages/regularCollection/SavingReportSheet'))
const LoanReport = lazy(() => import('./pages/regularCollection/LoanReport'))
const LoanReportSheet = lazy(() => import('./pages/regularCollection/LoanReportSheet'))
const Field = lazy(() => import('./pages/field/Field'))
const Center = lazy(() => import('./pages/center/Center'))
const Category = lazy(() => import('./pages/category/Category'))
const Accounts = lazy(() => import('./pages/accountManagement/Accounts'))
const Income = lazy(() => import('./pages/accountManagement/Income'))
const Expense = lazy(() => import('./pages/accountManagement/Expense'))
const Transfers = lazy(() => import('./pages/accountManagement/Transfers'))
const Transactions = lazy(() => import('./pages/accountManagement/Transactions'))
const Withdrawal = lazy(() => import('./pages/accountManagement/Withdrawal'))
const IncomeCategories = lazy(() => import('./pages/accountManagement/IncomeCategories'))
const ExpenseCategories = lazy(() => import('./pages/accountManagement/ExpenseCategories'))
const Staffs = lazy(() => import('./pages/staffs/Staffs'))
const StaffRoles = lazy(() => import('./pages/staffs/StaffRoles'))
const StaffPermissions = lazy(() => import('./pages/staffs/StaffPermissions'))
const AppSettings = lazy(() => import('./pages/configurations/AppSettings'))
const ApprovalsConfig = lazy(() => import('./pages/configurations/ApprovalsConfig'))
const CategoriesConfig = lazy(() => import('./pages/configurations/CategoriesConfig'))
const ClientRegisterAccount = lazy(() => import('./pages/clientAccount/ClientRegisterAccount'))
const PendingWithdrawal = lazy(() => import('./pages/pendingWithdrawals/PendingWithdrawal'))
const PendingClosing = lazy(() => import('./pages/pendingClosings/PendingClosing'))
const Search = lazy(() => import('./pages/searchAccount/SearchAccount'))
const AuditReportMeta = lazy(() => import('./pages/audit/AuditReportMeta'))
const AuditReport = lazy(() => import('./pages/audit/AuditReport'))
const RegisteredClientAccountList = lazy(
  () => import('./pages/registeredAccountList/RegisteredClientAccountList')
)
const RegisteredSavingAccountList = lazy(
  () => import('./pages/registeredAccountList/RegisteredSavingAccountList')
)
const RegisteredLoanAccountList = lazy(
  () => import('./pages/registeredAccountList/RegisteredLoanAccountList')
)

const t = () => {}
export default function App() {
  const { company_logo_uri } = useAppSettingsValue()
  // const { t } = useTranslation()

  return (
    <>
      {company_logo_uri && (
        <Helmet>
          <link rel="icon" type="image/x-icon" href={company_logo_uri} />
        </Helmet>
      )}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* UnAuthenticate Routes */}
          <Route path="/*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Layout pageTitle="page_name.login" />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/forgot-password" element={<Layout pageTitle="page_name.forgot_password" />}>
            <Route index element={<ForgotPassword />} />
          </Route>
          <Route
            path="/account-verification"
            element={<Layout pageTitle="page_name.account_verification" />}>
            <Route index element={<AccountVerification />} />
          </Route>

          {/* Authenticate Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard pageTitle="menu.dashboard" />} />
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

            {/* Search Routes */}
            <Route
              path="search"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Loader />}>
                    <Search />
                  </Suspense>
                </ErrorBoundary>
              }
            />

            {/* Client Account Routes */}
            <Route
              path="client-register/:id"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Loader />}>
                    <ClientRegisterAccount />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="saving-account/:id"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Loader />}>
                    <ClientRegisterAccount module="saving" />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="loan-account/:id"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Loader />}>
                    <ClientRegisterAccount module="loan" />
                  </Suspense>
                </ErrorBoundary>
              }
            />

            {/* Client Registrations Routes */}
            <Route path="registration">
              <Route
                path="client"
                element={
                  <RequirePermissions
                    allowedPermissions={['client_registration']}
                    pageTitle="menu.registration.Client_Registration"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <ClientRegistration />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="saving-account"
                element={
                  <RequirePermissions
                    allowedPermissions={['saving_acc_registration']}
                    pageTitle="menu.registration.saving_account_registration"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <SavingAccReg />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="loan-account"
                element={
                  <RequirePermissions
                    allowedPermissions={['loan_acc_registration']}
                    pageTitle="menu.registration.loan_account_registration"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <LoanAccReg />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>

            {/* Collection Routes */}
            <Route path="collection">
              {/* Regular Collection Routes */}
              <Route path="regular">
                <Route
                  path="saving"
                  element={
                    <RequirePermissions
                      allowedPermissions={[
                        'regular_saving_collection_list_view',
                        'regular_saving_collection_list_view_as_admin'
                      ]}
                      pageTitle="menu.collection.Saving_Collection"
                    />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReport />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReport />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id/:field_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReportSheet />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
                <Route
                  path="loan"
                  element={
                    <RequirePermissions
                      allowedPermissions={[
                        'regular_loan_collection_list_view',
                        'regular_loan_collection_list_view_as_admin'
                      ]}
                      pageTitle="menu.collection.Loan_Collection"
                    />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReport />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReport />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id/:field_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReportSheet />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
              </Route>

              {/* Pending Collection Routes */}
              <Route path="pending">
                <Route
                  path="saving"
                  element={
                    <RequirePermissions
                      allowedPermissions={[
                        'pending_saving_collection_list_view',
                        'pending_saving_collection_list_view_as_admin'
                      ]}
                      pageTitle={`${t('common.pending')} ${t('menu.collection.Saving_Collection')}`}
                    />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReport isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReport isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id/:field_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <SavingReportSheet isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
                <Route
                  path="loan"
                  element={
                    <RequirePermissions
                      allowedPermissions={[
                        'pending_loan_collection_list_view',
                        'pending_loan_collection_list_view_as_admin'
                      ]}
                      pageTitle={`${t('common.pending')} ${t('menu.collection.Loan_Collection')}`}
                    />
                  }>
                  <Route
                    index
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReport isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReport isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":category_id/:field_id"
                    element={
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Suspense fallback={<Loader />}>
                          <LoanReportSheet isRegular={false} />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>
              </Route>
            </Route>

            {/* Pending Registrations Routes */}
            <Route path="pending/registration">
              <Route
                path="client"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_client_registration_list_view',
                      'pending_client_registration_list_view_as_admin'
                    ]}
                    pageTitle={`${t('common.pending')} ${t(
                      'menu.registration.Client_Registration'
                    )}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingClientReg />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="saving-account"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_saving_acc_list_view',
                      'pending_saving_acc_list_view_as_admin'
                    ]}
                    pageTitle={`${t('common.pending')} ${t(
                      'menu.registration.saving_account_registration'
                    )}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingSavingReg />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="loan-account"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_loan_acc_list_view',
                      'pending_loan_acc_list_view_as_admin'
                    ]}
                    pageTitle={`${t('common.pending')} ${t(
                      'menu.registration.loan_account_registration'
                    )}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingLoanReg />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>

            {/* Pending Loans */}
            <Route
              path="pending/loans"
              element={
                <RequirePermissions
                  allowedPermissions={['pending_loan_view', 'pending_loan_view_as_admin']}
                  pageTitle="menu.label.pending_loans"
                />
              }>
              <Route
                index
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loader />}>
                      <PendingLoans />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>

            {/* Pending Withdrawal Routes */}
            <Route path="pending/withdrawal">
              <Route
                path="saving"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_saving_withdrawal_list_view',
                      'pending_saving_withdrawal_list_view_as_admin'
                    ]}
                    pageTitle={`${t('common.pending')} ${t('menu.withdrawal.Saving_Withdrawal')}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingWithdrawal prefix="saving" />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="loan-saving"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_loan_saving_withdrawal_list_view',
                      'pending_loan_saving_withdrawal_list_view_as_admin'
                    ]}
                    pageTitle={`${t('common.pending')} ${t(
                      'menu.withdrawal.Loan_Saving_Withdrawal'
                    )}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingWithdrawal prefix="loan-saving" />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>

            {/* Pending Closing Request Routes */}
            <Route path="pending/delete">
              <Route
                path="saving"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_req_to_delete_saving_acc_list_view',
                      'pending_req_to_delete_saving_acc_list_view_as_admin'
                    ]}
                    pageTitle={['common.pending', 'menu.delete.Saving_Delete']}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingClosing prefix="saving" />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="loan-saving"
                element={
                  <RequirePermissions
                    allowedPermissions={[
                      'pending_req_to_delete_loan_acc_list_view',
                      'pending_req_to_delete_loan_acc_list_view_as_admin'
                    ]}
                    pageTitle={['common.pending', 'menu.delete.Loan_Delete']}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <PendingClosing prefix="loan" />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>

            {/* Field, Center, Category */}
            <Route
              path="fields"
              element={
                <RequirePermissions
                  allowedPermissions={['field_list_view']}
                  pageTitle="menu.label.field"
                />
              }>
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
              element={
                <RequirePermissions
                  allowedPermissions={['center_list_view']}
                  pageTitle="menu.label.center"
                />
              }>
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
              element={
                <RequirePermissions
                  allowedPermissions={['category_list_view']}
                  pageTitle="menu.label.category"
                />
              }>
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

            {/* Registered Account Routes */}
            <Route path="registered">
              <Route
                path="client"
                element={
                  <RequirePermissions
                    allowedPermissions={['registered_client_account_list_view']}
                    pageTitle={`${t('menu.registration.Client_Registration')} ${t('common.list')}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <RegisteredClientAccountList />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="saving-account"
                element={
                  <RequirePermissions
                    allowedPermissions={['registered_saving_account_list_view']}
                    pageTitle={`${t('menu.registration.saving_account_registration')} ${t('common.list')}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <RegisteredSavingAccountList />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="loan-account"
                element={
                  <RequirePermissions
                    allowedPermissions={['registered_loan_account_list_view']}
                    pageTitle={`${t('menu.registration.loan_account_registration')} ${t('common.list')}`}
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <RegisteredLoanAccountList />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>

            {/* Account Management Routes */}
            <Route path="accounts">
              <Route
                element={
                  <RequirePermissions
                    allowedPermissions={['account_list_view']}
                    pageTitle="menu.account_management.Accounts"
                  />
                }>
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
              {/* Account Transfer */}
              <Route
                path="transfers"
                element={
                  <RequirePermissions
                    allowedPermissions={['account_transfer_list_view']}
                    pageTitle="menu.account_management.Transfers"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <Transfers />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              {/* Account Transfer */}
              <Route
                path="transactions"
                element={
                  <RequirePermissions
                    allowedPermissions={['account_transaction_list_view']}
                    pageTitle="menu.account_management.Transactions"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <Transactions />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              {/* Account Withdrawal */}
              <Route
                path="withdrawals"
                element={
                  <RequirePermissions
                    allowedPermissions={['account_withdrawal_list_view']}
                    pageTitle="menu.account_management.Withdrawals"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <Withdrawal />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              {/* Income */}
              <Route path="incomes">
                <Route
                  element={
                    <RequirePermissions
                      allowedPermissions={['income_list_view']}
                      pageTitle="menu.account_management.Incomes"
                    />
                  }>
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
                    <RequirePermissions
                      allowedPermissions={['income_category_list_view']}
                      pageTitle="menu.account_management.Income_Categories"
                    />
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
              <Route path="expenses">
                <Route
                  element={
                    <RequirePermissions
                      allowedPermissions={['expense_list_view']}
                      pageTitle="menu.account_management.Expenses"
                    />
                  }>
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
                    <RequirePermissions
                      allowedPermissions={['expense_category_list_view']}
                      pageTitle="menu.account_management.Expense_Categories"
                    />
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
              element={
                <RequirePermissions
                  allowedPermissions={['staff_list_view']}
                  pageTitle="menu.staffs.Staffs"
                />
              }>
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
              element={
                <RequirePermissions
                  allowedPermissions={['role_list_view']}
                  pageTitle="menu.staffs.Staff_Roles"
                />
              }>
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
              element={
                <RequirePermissions
                  allowedPermissions={['staff_permission_update']}
                  pageTitle="menu.staffs.Staff_Permissions"
                />
              }>
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
              <Route
                element={
                  <RequirePermissions
                    allowedPermissions={['app_settings']}
                    pageTitle="menu.settings_and_privacy.app_settings"
                  />
                }>
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
                element={
                  <RequirePermissions
                    allowedPermissions={['approvals_config']}
                    pageTitle="menu.settings_and_privacy.approvals_config"
                  />
                }>
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
                element={
                  <RequirePermissions
                    allowedPermissions={['categories_config']}
                    pageTitle="menu.settings_and_privacy.categories_config"
                  />
                }>
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

            {/* Audit Routes */}
            <Route path="audit-report">
              <Route
                element={
                  <RequirePermissions
                    allowedPermissions={['cooperative_audit_report_view']}
                    pageTitle="menu.audit.audit_report"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <AuditReport />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="meta"
                element={
                  <RequirePermissions
                    allowedPermissions={['audit_report_meta_list_view']}
                    pageTitle="menu.audit.report_meta"
                  />
                }>
                <Route
                  index
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <AuditReportMeta />
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
