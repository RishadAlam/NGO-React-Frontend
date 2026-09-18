import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import PendingClientReg from '../pages/pendingRegistrations/PendingClientReg'
import PendingSavingReg from '../pages/pendingRegistrations/PendingSavingReg'
import PendingLoanReg from '../pages/pendingRegistrations/PendingLoanReg'

const fixture = vi.hoisted(() => ({
  row: {
    id: 7,
    name: 'Test member',
    acc_no: '1007',
    status: 0,
    is_approved: 0,
    is_default: 0,
    field_id: 1,
    center_id: 2,
    category_id: 3,
    creator_id: 1,
    client_registration_id: 4,
    field: { id: 1, name: 'Field' },
    center: { id: 2, name: 'Center', field_id: 1 },
    category: { id: 3, name: 'Standard', is_default: 0, group: 'Savings' },
    author: { id: 1, name: 'Collector' },
    client_registration: { id: 4, name: 'Test member', acc_no: '1007', image_uri: null },
    nominees: [],
    guarantors: [],
    payable_deposit: 100,
    payable_installment: 12,
    payable_interest: 0,
    total_deposit_without_interest: 1200,
    total_deposit_with_interest: 1200,
    loan_given: 1200,
    total_payable_interest: 0,
    total_payable_loan_with_interest: 1200,
    loan_installment: 100,
    interest_installment: 0,
    start_date: '2026-09-18',
    duration_date: '2027-09-18',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z'
  }
}))

vi.mock('../hooks/useFetch', () => ({
  default: ({ action }) => {
    let data = []
    if (action.includes('pending-forms')) data = [fixture.row]
    else if (action.startsWith('fields/')) data = [fixture.row.field]
    else if (action.startsWith('centers/')) data = [fixture.row.center]
    else if (action.startsWith('categories/')) data = [fixture.row.category]
    else if (action.startsWith('users/')) data = [fixture.row.author]
    else if (action.startsWith('client/registration/accounts/')) {
      data = [fixture.row.client_registration]
    }
    return { data: { data }, mutate: vi.fn(), isLoading: false }
  }
}))

let setAuth
function AuthControl() {
  setAuth = useSetRecoilState(authDataState)
  return null
}

function mount(Page, permissions, width = 390) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { id: 1, accessToken: 'test-token', permissions })
        set(windowInnerWidthState, width)
      }}>
      <AuthControl />
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    </RecoilRoot>
  )
}

function mobileRow() {
  return within(document.querySelector('[role="listitem"]'))
}

describe.each([
  ['saving', PendingSavingReg, 'pending_saving_acc_update', 'saving.edit_saving_acc'],
  ['loan', PendingLoanReg, 'pending_loan_acc_update', 'loan.edit_loan_acc']
])('Pending %s registration editing', (_type, Page, permission, title) => {
  it('opens the real mobile edit form using the account-specific update grant', () => {
    mount(Page, [permission])
    fireEvent.click(mobileRow().getByRole('button', { name: 'common.edit' }))
    expect(within(screen.getByRole('dialog')).getByText(title)).toBeTruthy()
  })

  it('does not expose Edit through the unrelated client-registration grant', () => {
    mount(Page, ['pending_client_registration_update'])
    expect(mobileRow().queryByRole('button', { name: 'common.edit' })).toBeNull()
  })

  it.each([768, 1024])('preserves the existing desktop form gate at %i px', (width) => {
    mount(Page, [permission], width)
    fireEvent.click(within(screen.getByRole('table')).getByRole('button', { name: 'common.edit' }))
    expect(screen.queryByText(title)).toBeNull()
  })
})

describe('Pending client registration mobile row actions', () => {
  it.each([
    ['pending_client_registration_list_view', 'common.view'],
    ['pending_client_registration_update', 'common.edit'],
    ['pending_client_registration_permanently_delete', 'common.delete']
  ])('exposes only the independently granted %s action', (permission, label) => {
    mount(PendingClientReg, [permission])
    expect(mobileRow().getByRole('button', { name: label })).toBeTruthy()
    expect(mobileRow().getAllByRole('button')).toHaveLength(1)
  })

  it('removes cached Edit after the grant is revoked', () => {
    mount(PendingClientReg, ['pending_client_registration_update'])
    expect(mobileRow().getByRole('button', { name: 'common.edit' })).toBeTruthy()
    act(() => setAuth({ id: 1, accessToken: 'test-token', permissions: [] }))
    expect(mobileRow().queryByRole('button', { name: 'common.edit' })).toBeNull()
  })

  it('keeps denied row actions absent', () => {
    mount(PendingClientReg, ['pending_client_registration_approval'])
    expect(mobileRow().queryByRole('button')).toBeNull()
  })

  it('preserves the existing desktop Edit action', () => {
    mount(PendingClientReg, ['pending_client_registration_update'], 1024)
    expect(
      within(screen.getByRole('table')).getByRole('button', { name: 'common.edit' })
    ).toBeTruthy()
  })
})
