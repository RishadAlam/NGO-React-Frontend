import axios from 'axios'
import { createElement } from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import EditClientProfileModal from '../components/pendingReg/EditClientProfileModal'
import EditSavingAccountModal from '../components/pendingReg/EditSavingAccountModal'
import EditLoanAccountModal from '../components/pendingReg/EditLoanAccountModal'
import xFetch from '../utilities/xFetch'

// These are the external boundaries: current login state and HTTP dispatch.
// The production xFetch function and permission resolver remain real.
const session = vi.hoisted(() => ({ auth: {} }))
vi.mock('recoil-nexus', () => ({ getRecoil: () => session.auth }))
vi.mock('axios', () => ({ default: vi.fn() }))
vi.mock('../hooks/useFetch', () => ({ default: () => ({ data: { data: [] } }) }))

const unauthorized = { status: 403, success: false, message: 'This action is unauthorized.' }
const token = 'Bearer current-user'
const request = (endpoint, data = null, method = 'PUT', requestToken = token) =>
  xFetch(endpoint, data, null, requestToken, null, method)

// Literal expectations audited against the existing action guards/catalog,
// independent of the resolver's implementation.
const mutations = [
  ['POST', 'fields', 'field_registration'],
  ['PUT', 'fields/12', 'field_data_update'],
  ['POST', 'centers', 'center_registration'],
  ['PUT', 'centers/12', 'center_data_update'],
  ['PUT', 'centers/change-status/12', 'center_data_update'],
  ['DELETE', 'centers/12', 'center_soft_delete'],
  ['POST', 'categories', 'category_registration'],
  ['PUT', 'categories/12', 'category_data_update'],
  ['PUT', 'categories/change-status/12', 'category_data_update'],
  ['DELETE', 'categories/12', 'category_soft_delete'],
  ['POST', 'accounts', 'account_registration'],
  ['PUT', 'accounts/12', 'account_data_update'],
  ['PUT', 'accounts/change-status/12', 'account_data_update'],
  ['DELETE', 'accounts/12', 'account_soft_delete'],
  ['POST', 'accounts/incomes', 'income_registration'],
  ['PUT', 'accounts/incomes/12', 'income_data_update'],
  ['DELETE', 'accounts/incomes/12', 'income_soft_delete'],
  ['POST', 'expenses', 'expense_registration'],
  ['PUT', 'accounts/expenses/12', 'expense_data_update'],
  ['DELETE', 'accounts/expenses/12', 'expense_soft_delete'],
  ['POST', 'accounts/incomes/categories', 'income_category_registration'],
  ['PUT', 'accounts/incomes/categories/12', 'income_category_data_update'],
  ['PUT', 'accounts/incomes/categories/change-status/12', 'income_category_data_update'],
  ['DELETE', 'accounts/incomes/categories/12', 'income_category_soft_delete'],
  ['POST', 'accounts/expenses/categories', 'expense_category_registration'],
  ['PUT', 'accounts/expenses/categories/12', 'expense_category_data_update'],
  ['PUT', 'accounts/expenses/categories/change-status/12', 'expense_category_data_update'],
  ['DELETE', 'accounts/expenses/categories/12', 'expense_category_soft_delete'],
  ['POST', 'accounts/withdrawals', 'account_withdrawal_registration'],
  ['PUT', 'accounts/withdrawals/12', 'account_withdrawal_data_update'],
  ['DELETE', 'accounts/withdrawals/12', 'account_withdrawal_soft_delete'],
  ['POST', 'accounts/transfers', 'account_transfer_registration'],
  ['POST', 'users', 'staff_registration'],
  ['PUT', 'users/12', 'staff_data_update'],
  ['PUT', 'users/change-status/12', 'staff_status_update'],
  ['DELETE', 'users/12', 'staff_soft_delete'],
  ['PUT', 'permissions/12', 'staff_permission_update'],
  ['POST', 'roles', 'role_registration'],
  ['PUT', 'roles/12', 'role_update'],
  ['DELETE', 'roles/12', 'role_delete'],
  ['PUT', 'roles/12/permissions', 'role_permission_update'],
  ['POST', 'audit/meta', 'audit_report_meta_create'],
  ['PUT', 'audit/meta/12', 'audit_report_meta_update'],
  ['DELETE', 'audit/meta/12', 'audit_report_meta_soft_delete'],
  ['PUT', 'approvals-config-update', 'approvals_config'],
  ['PUT', 'transfer-transaction-config-update', 'approvals_config'],
  ['PUT', 'categories-config-update', 'categories_config'],
  ['PUT', 'app-settings-update', 'app_settings'],
  ['POST', 'client/registration', 'client_registration'],
  ['POST', 'client/registration/saving', 'saving_acc_registration'],
  ['POST', 'client/registration/loan', 'loan_acc_registration'],
  ['PUT', 'client/registration/approved/12', 'pending_client_registration_approval'],
  ['PUT', 'client/registration/saving/approved/12', 'pending_saving_acc_approval'],
  ['PUT', 'client/registration/loan/approved/12', 'pending_loan_acc_approval'],
  ['PUT', 'client/registration/loan/loan-approved/12', 'pending_loan_approval'],
  ['DELETE', 'client/force-delete/12', 'pending_client_registration_permanently_delete'],
  ['DELETE', 'client/saving/force-delete/12', 'pending_saving_acc_permanently_delete'],
  ['DELETE', 'client/loan/force-delete/12', 'pending_loan_acc_permanently_delete'],
  ['DELETE', 'client/registration/12', 'client_register_account_delete'],
  ['PUT', 'client/registration/field-update/12', 'client_register_account_field_update'],
  ['PUT', 'client/registration/center-update/12', 'client_register_account_center_update'],
  ['PUT', 'client/registration/acc-no-update/12', 'client_register_account_acc_no_update'],
  ['PUT', 'client/registration/saving/category-update/12', 'client_saving_account_category_update'],
  ['PUT', 'client/registration/loan/category-update/12', 'client_loan_account_category_update'],
  ['PUT', 'client/registration/saving/change-status/12', 'client_saving_account_change_status'],
  ['PUT', 'client/registration/loan/change-status/12', 'client_loan_account_change_status'],
  ['POST', 'saving/check', 'client_saving_account_check'],
  ['POST', 'loan/check', 'client_loan_account_check'],
  ['POST', 'closing/saving', 'client_saving_account_closing'],
  ['POST', 'closing/loan', 'client_loan_account_closing'],
  ['PUT', 'closing/saving/approved/12', 'pending_req_to_delete_saving_acc_approval'],
  ['PUT', 'closing/loan/approved/12', 'pending_req_to_delete_loan_acc_approval'],
  ['DELETE', 'closing/saving/12', 'pending_req_to_delete_saving_acc_delete'],
  ['DELETE', 'closing/loan/12', 'pending_req_to_delete_loan_acc_delete'],
  ['POST', 'withdrawal/saving', 'permission_to_make_saving_withdrawal'],
  ['POST', 'withdrawal/loan-saving', 'permission_to_make_loan_saving_withdrawal'],
  ['PUT', 'withdrawal/saving/12', 'pending_saving_withdrawal_update'],
  ['PUT', 'withdrawal/loan-saving/12', 'pending_loan_saving_withdrawal_update'],
  ['PUT', 'withdrawal/saving/approved/12', 'pending_saving_withdrawal_approval'],
  ['PUT', 'withdrawal/loan-saving/approved/12', 'pending_loan_saving_withdrawal_approval'],
  ['DELETE', 'withdrawal/saving/12', 'pending_saving_withdrawal_delete'],
  ['DELETE', 'withdrawal/loan-saving/12', 'pending_loan_saving_withdrawal_delete'],
  ['POST', 'collection/saving', 'permission_to_do_saving_collection'],
  ['POST', 'collection/loan', 'permission_to_do_loan_collection'],
  [
    'GET',
    'transactions/approve-transactions/12/saving_to_loan',
    'pending_client_transactions_approval'
  ],
  [
    'DELETE',
    'transactions/delete-transactions/12/loan_to_saving',
    'pending_client_transactions_delete'
  ],
  ['POST', 'recycle-bin/field/12/restore', 'recycle_bin_restore'],
  ['DELETE', 'recycle-bin/field/12/force', 'recycle_bin_force_delete']
]

beforeEach(() => {
  window.innerWidth = 390
  vi.stubEnv('VITE_BASE_URI', 'https://test.invalid')
  session.auth = { id: 7, accessToken: token, permissions: [] }
  axios.mockReset()
  axios.mockResolvedValue({ data: { success: true } })
})

describe('Mobile permission checks at the HTTP dispatch boundary', () => {
  it('rejects a field viewer status mutation before it reaches HTTP', async () => {
    session.auth.permissions = ['field_list_view']
    await expect(request('fields/change-status/12', { status: true })).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })

  it('does not accept an unrelated update permission', async () => {
    session.auth.permissions = ['center_data_update']
    await expect(request('fields/change-status/12', { status: true })).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })

  it('dispatches the original field status request with its exact update grant', async () => {
    session.auth.permissions = ['field_data_update']
    await expect(request('fields/change-status/12', { status: true })).resolves.toEqual({
      success: true
    })
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios.mock.calls[0][0]).toMatchObject({
      method: 'PUT',
      data: '{"status":true}',
      headers: { Authorization: token }
    })
  })

  it('rechecks current grants after a delayed deletion confirmation', async () => {
    session.auth.permissions = ['field_soft_delete']
    let confirm
    const confirmation = new Promise((resolve) => {
      confirm = resolve
    })
    const result = confirmation.then(() => request('fields/12', null, 'DELETE'))
    session.auth = { ...session.auth, permissions: ['field_list_view'] }
    confirm()
    await expect(result).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })

  it('rejects a delayed request from a different authenticated session', async () => {
    session.auth = { id: 8, accessToken: 'Bearer next-user', permissions: ['field_data_update'] }
    await expect(request('fields/change-status/12', { status: true })).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })

  it.each([768, 1024, 1440])('preserves the existing dispatch behavior at %i px', async (width) => {
    window.innerWidth = width
    await expect(request('fields/change-status/12', { status: true })).resolves.toEqual({
      success: true
    })
    expect(axios).toHaveBeenCalledTimes(1)
  })
})

describe.each(mutations)('%s %s requires %s', (method, endpoint, grant) => {
  it('blocks missing grants before HTTP', async () => {
    await expect(request(endpoint, {}, method)).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })
  it('blocks an unrelated grant before HTTP', async () => {
    session.auth.permissions = ['registered_client_account_list_view']
    await expect(request(endpoint, {}, method)).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
  })
  it('allows exactly the established grant', async () => {
    session.auth.permissions = [grant]
    await expect(request(endpoint, {}, method)).resolves.toEqual({ success: true })
    expect(axios).toHaveBeenCalledTimes(1)
  })
})

describe('Payload-derived policies', () => {
  it('guards the actual multipart POST used by AppSettings', async () => {
    const data = new FormData()
    data.append('_method', 'PUT')
    data.append('company_name', 'Example cooperative')
    await expect(
      xFetch('app-settings-update', data, null, token, null, 'POST', true)
    ).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
    session.auth.permissions = ['app_settings']
    await expect(
      xFetch('app-settings-update', data, null, token, null, 'POST', true)
    ).resolves.toEqual({ success: true })
    expect(axios.mock.calls[0][0]).toMatchObject({ method: 'POST', data })
  })
  it.each([
    ['saving_to_saving', 'make_saving_transactions', 'make_loan_transactions'],
    ['saving_to_loan', 'make_saving_transactions', 'make_loan_transactions'],
    ['loan_to_saving', 'make_loan_transactions', 'make_saving_transactions'],
    ['loan_to_loan', 'make_loan_transactions', 'make_saving_transactions']
  ])('checks the sending account grant for %s', async (type, grant, unrelated) => {
    session.auth.permissions = [unrelated]
    await expect(request('transactions', { type }, 'POST')).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
    session.auth.permissions = [grant]
    await expect(request('transactions', { type }, 'POST')).resolves.toEqual({ success: true })
    expect(axios).toHaveBeenCalledTimes(1)
  })
  it.each([undefined, '', 'saving', 'arbitrary_to_saving'])(
    'does not guess an ambiguous transaction type %s',
    async (type) => {
      session.auth.permissions = ['make_saving_transactions', 'make_loan_transactions']
      await expect(request('transactions', { type }, 'POST')).rejects.toEqual(unauthorized)
      expect(axios).not.toHaveBeenCalled()
    }
  )
  it('does not allow staff profile updates to reset credentials without the separate grant', async () => {
    session.auth.permissions = ['staff_data_update']
    await expect(
      request('users/12', { password: 'new-secret', confirm_password: 'new-secret' })
    ).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
    session.auth.permissions.push('staff_reset_password')
    await expect(
      request('users/12', { password: 'new-secret', confirm_password: 'new-secret' })
    ).resolves.toEqual({ success: true })
  })
  it('honors the existing multipart method override instead of treating edits as creation', async () => {
    const data = new FormData()
    data.append('_method', 'PUT')
    session.auth.permissions = ['field_registration']
    await expect(request('fields/12', data, 'POST')).rejects.toEqual(unauthorized)
    expect(axios).not.toHaveBeenCalled()
    session.auth.permissions = ['field_data_update']
    await expect(request('fields/12', data, 'POST')).resolves.toEqual({ success: true })
  })
})

describe('Public requests and reads stay outside mutation authorization', () => {
  it.each([
    ['POST', 'login'],
    ['POST', 'logout'],
    ['POST', 'verify-user'],
    ['POST', 'forget-password'],
    ['PUT', 'reset-password'],
    ['POST', 'account-verification'],
    ['GET', 'otp-resend/12'],
    ['GET', 'authorization'],
    ['GET', 'app-settings'],
    ['GET', 'approvals-config'],
    ['POST', 'categories-config/element/12'],
    ['POST', 'profile-update'],
    ['GET', 'fields'],
    ['GET', 'fields/12'],
    ['GET', 'transactions/pending-transactions/saving_to_loan']
  ])('preserves %s %s without business-action grants', async (method, endpoint) => {
    session.auth = {}
    await expect(request(endpoint, {}, method, null)).resolves.toEqual({ success: true })
    expect(axios).toHaveBeenCalledTimes(1)
  })
})

const contextualMutations = [
  [
    'PUT',
    'collection/saving/12',
    'regular_saving_collection_update',
    'pending_saving_collection_update'
  ],
  [
    'PUT',
    'collection/saving/12',
    'pending_saving_collection_update',
    'regular_saving_collection_update'
  ],
  [
    'PUT',
    'collection/saving/12',
    'client_saving_account_collection_update',
    'pending_saving_collection_update'
  ],
  ['PUT', 'collection/loan/12', 'regular_loan_collection_update', 'pending_loan_collection_update'],
  ['PUT', 'collection/loan/12', 'pending_loan_collection_update', 'regular_loan_collection_update'],
  [
    'PUT',
    'collection/loan/12',
    'client_loan_account_collection_update',
    'pending_loan_collection_update'
  ],
  [
    'DELETE',
    'collection/saving/force-delete/12',
    'regular_saving_collection_permanently_delete',
    'pending_saving_collection_permanently_delete'
  ],
  [
    'DELETE',
    'collection/saving/force-delete/12',
    'pending_saving_collection_permanently_delete',
    'regular_saving_collection_permanently_delete'
  ],
  [
    'DELETE',
    'collection/saving/force-delete/12',
    'client_saving_account_collection_permanently_delete',
    'pending_saving_collection_permanently_delete'
  ],
  [
    'DELETE',
    'collection/loan/force-delete/12',
    'regular_loan_collection_permanently_delete',
    'pending_loan_collection_permanently_delete'
  ],
  [
    'DELETE',
    'collection/loan/force-delete/12',
    'pending_loan_collection_permanently_delete',
    'regular_loan_collection_permanently_delete'
  ],
  [
    'DELETE',
    'collection/loan/force-delete/12',
    'client_loan_account_collection_permanently_delete',
    'pending_loan_collection_permanently_delete'
  ],
  [
    'POST',
    'collection/saving/approved',
    'regular_saving_collection_approval',
    'pending_saving_collection_approval'
  ],
  [
    'POST',
    'collection/saving/approved',
    'pending_saving_collection_approval',
    'regular_saving_collection_approval'
  ],
  [
    'POST',
    'collection/loan/approved',
    'regular_loan_collection_approval',
    'pending_loan_collection_approval'
  ],
  [
    'POST',
    'collection/loan/approved',
    'pending_loan_collection_approval',
    'regular_loan_collection_approval'
  ],
  [
    'PUT',
    'client/registration/12',
    'pending_client_registration_update',
    'client_register_account_update'
  ],
  [
    'PUT',
    'client/registration/12',
    'client_register_account_update',
    'pending_client_registration_update'
  ],
  [
    'PUT',
    'client/registration/saving/12',
    'pending_saving_acc_update',
    'client_saving_account_update'
  ],
  [
    'PUT',
    'client/registration/saving/12',
    'client_saving_account_update',
    'pending_saving_acc_update'
  ],
  ['PUT', 'client/registration/loan/12', 'pending_loan_acc_update', 'client_loan_account_update'],
  ['PUT', 'client/registration/loan/12', 'client_loan_account_update', 'pending_loan_acc_update']
]

describe.each(contextualMutations)(
  'Contextual %s %s requires %s',
  (method, endpoint, grant, siblingGrant) => {
    const dispatch = (mobilePermission) => {
      const data = new FormData()
      data.append('_method', method)
      return xFetch(endpoint, data, null, token, null, method === 'PUT' ? 'POST' : method, true, {
        mobilePermission
      })
    }
    it('does not borrow a grant from a different workflow sharing the endpoint', async () => {
      session.auth.permissions = [siblingGrant]
      await expect(dispatch(grant)).rejects.toEqual(unauthorized)
      expect(axios).not.toHaveBeenCalled()
    })
    it('rejects missing context instead of guessing from current grants', async () => {
      session.auth.permissions = [grant, siblingGrant]
      await expect(dispatch(undefined)).rejects.toEqual(unauthorized)
      expect(axios).not.toHaveBeenCalled()
    })
    it('rejects a supplied grant that does not belong to this endpoint/action', async () => {
      session.auth.permissions = ['field_list_view']
      await expect(dispatch('field_list_view')).rejects.toEqual(unauthorized)
      expect(axios).not.toHaveBeenCalled()
    })
    it('dispatches when the exact action context is still authorized', async () => {
      session.auth.permissions = [grant]
      await expect(dispatch(grant)).resolves.toEqual({ success: true })
      expect(axios).toHaveBeenCalledTimes(1)
    })
  }
)

describe('Incomplete mobile sessions', () => {
  it.each([{}, { permissions: [] }, { permissions: null }, { permissions: 'field_data_update' }])(
    'fails closed for an invalid auth snapshot',
    async (auth) => {
      session.auth = auth
      await expect(request('fields/change-status/12', { status: true })).rejects.toEqual(
        unauthorized
      )
      expect(axios).not.toHaveBeenCalled()
    }
  )
})

const address = {
  street_address: 'Street',
  city: 'City',
  post_office: 'Post',
  police_station: 'Station',
  district: 'District',
  division: 'Division'
}
const client = {
  id: 12,
  field_id: 1,
  center_id: 1,
  acc_no: '100',
  name: 'Member',
  father_name: 'Father',
  mother_name: 'Mother',
  nid: '123',
  dob: '1990-01-01',
  occupation: 'Service',
  religion: 'Islam',
  gender: 'male',
  primary_phone: '01700000000',
  share: 1,
  present_address: address,
  permanent_address: address
}
const account = {
  id: 12,
  field_id: 1,
  center_id: 1,
  category_id: 1,
  creator_id: 1,
  client_registration_id: 1,
  acc_no: '100',
  start_date: '2026-01-01',
  duration_date: '2027-01-01',
  payable_deposit: 10,
  payable_installment: 10,
  payable_interest: 10,
  total_deposit_without_interest: 100,
  total_deposit_with_interest: 110,
  loan_given: 100,
  total_payable_interest: 10,
  total_payable_loan_with_interest: 110,
  loan_installment: 10,
  interest_installment: 1,
  total_payable_loan_installment: 11,
  nominees: [],
  guarantors: []
}

describe.each([
  [
    'client',
    EditClientProfileModal,
    'pending_client_registration_update',
    'client_register_account_update',
    'profileData',
    client
  ],
  [
    'saving',
    EditSavingAccountModal,
    'pending_saving_acc_update',
    'client_saving_account_update',
    'accountData',
    account
  ],
  [
    'loan',
    EditLoanAccountModal,
    'pending_loan_acc_update',
    'client_loan_account_update',
    'accountData',
    account
  ]
])('Shared edit form context: %s', (_kind, Form, pendingGrant, registeredGrant, prop, values) => {
  it.each(['pending', 'registered'])(
    'allows its authorized %s workflow to submit through real xFetch',
    async (scope) => {
      const grant = scope === 'pending' ? pendingGrant : registeredGrant
      session.auth.permissions = [grant]
      const close = vi.fn()
      render(
        createElement(
          RecoilRoot,
          { initializeState: ({ set }) => set(authDataState, session.auth) },
          createElement(
            MemoryRouter,
            null,
            createElement(Form, {
              open: true,
              setOpen: close,
              mutate: vi.fn(),
              [prop]: values,
              ...(scope === 'registered' ? { mobilePermission: registeredGrant } : {})
            })
          )
        )
      )
      fireEvent.submit(document.querySelector('form'))
      await waitFor(() => expect(close).toHaveBeenCalledWith(false))
      expect(axios).toHaveBeenCalledTimes(1)
    }
  )
})
