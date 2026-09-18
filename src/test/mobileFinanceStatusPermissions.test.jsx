import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Accounts from '../pages/accountManagement/Accounts'
import IncomeCategories from '../pages/accountManagement/IncomeCategories'
import ExpenseCategories from '../pages/accountManagement/ExpenseCategories'
import PendingClientReg from '../pages/pendingRegistrations/PendingClientReg'

const fixture = vi.hoisted(() => ({
  auth: {},
  row: {
    id: 7,
    name: 'Test account',
    acc_no: '1007',
    acc_details: '',
    description: '',
    status: 1,
    is_approved: 0,
    is_default: 0,
    balance: 500,
    total_deposit: 500,
    total_withdrawal: 0,
    author: null,
    field: null,
    center: null,
    image_uri: null,
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z',
    account_action_history: []
  }
}))

// Keep real pages, tables, switches and modals; replace the network-facing data hook only.
vi.mock('../hooks/useFetch', () => ({
  default: () => ({ data: { data: [fixture.row] }, mutate: vi.fn(), isLoading: false })
}))
vi.mock('recoil-nexus', () => ({ default: () => null, getRecoil: () => fixture.auth }))

let setAuth
function AuthControl() {
  fixture.auth = useRecoilValue(authDataState)
  setAuth = useSetRecoilState(authDataState)
  return null
}

function mount(Page, permissions = [], width = 390) {
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

function setPermissions(permissions) {
  act(() => setAuth({ id: 1, accessToken: 'test-token', permissions }))
}

function mobileRow() {
  return within(document.querySelector('[role="listitem"]'))
}

beforeEach(() => {
  fixture.row.status = 1
  fixture.row.is_approved = 0
})

const financePages = [
  {
    name: 'Accounts',
    Page: Accounts,
    update: 'account_data_update',
    create: 'account_registration',
    createLabel: 'account.Account_Registration'
  },
  {
    name: 'Income categories',
    Page: IncomeCategories,
    update: 'income_category_data_update',
    create: 'income_category_registration',
    createLabel: 'income_categories.Income_Categories_Registration'
  },
  {
    name: 'Expense categories',
    Page: ExpenseCategories,
    update: 'expense_category_data_update',
    create: 'expense_category_registration',
    createLabel: 'expense_categories.Expense_Categories_Registration'
  }
]

describe.each(financePages)('$name mobile permissions', ({ Page, update, create, createLabel }) => {
  it.each([
    [1, 'common.active'],
    [0, 'common.inactive']
  ])('shows status %i read-only without update permission', (status, label) => {
    fixture.row.status = status
    mount(Page, [create])
    const row = mobileRow()
    expect(row.queryByRole('checkbox', { hidden: true })).toBeNull()
    expect(row.getByText(label)).toBeTruthy()
  })

  it('does not expose creation to an update-only user', () => {
    mount(Page, [update])
    expect(screen.queryByRole('button', { name: createLabel })).toBeNull()
    expect(mobileRow().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
  })

  it('removes a live status control when update permission is revoked', () => {
    mount(Page, [update])
    expect(mobileRow().getByRole('checkbox', { hidden: true })).toBeTruthy()
    setPermissions([])
    expect(mobileRow().queryByRole('checkbox', { hidden: true })).toBeNull()
    expect(mobileRow().getByText('common.active')).toBeTruthy()
  })

  it('removes a cached edit action when update permission is revoked', () => {
    mount(Page, [update])
    expect(mobileRow().getByRole('button', { name: 'Edit' })).toBeTruthy()
    setPermissions([])
    expect(mobileRow().queryByRole('button', { name: 'Edit' })).toBeNull()
  })

  it('unmounts an open creation form when creation permission is revoked', () => {
    mount(Page, [create])
    fireEvent.click(screen.getByRole('button', { name: createLabel }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    setPermissions([])
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: createLabel })).toBeNull()
  })

  it.each([768, 1024])('preserves existing controls at desktop width %i', (width) => {
    mount(Page, [], width)
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByRole('button', { name: createLabel })).toBeTruthy()
    expect(within(screen.getByRole('table')).getByRole('checkbox', { hidden: true }).disabled).toBe(
      false
    )
  })
})

describe('Pending client registration mobile approval', () => {
  it.each([
    [0, 'common.pending'],
    [1, 'analytics.approval_status.approved']
  ])('shows approval %i read-only to a non-approver', (isApproved, label) => {
    fixture.row.is_approved = isApproved
    mount(PendingClientReg, ['pending_client_registration_list_view'])
    const row = mobileRow()
    expect(row.queryByRole('checkbox', { hidden: true })).toBeNull()
    expect(row.getByText(label)).toBeTruthy()
  })

  it('removes an approval control when approval permission is revoked', () => {
    mount(PendingClientReg, ['pending_client_registration_approval'])
    expect(mobileRow().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
    setPermissions(['pending_client_registration_list_view'])
    expect(mobileRow().queryByRole('checkbox', { hidden: true })).toBeNull()
  })

  it('preserves the existing desktop approval control', () => {
    mount(PendingClientReg, [], 1024)
    expect(within(screen.getByRole('table')).getByRole('checkbox', { hidden: true }).disabled).toBe(
      false
    )
  })
})
