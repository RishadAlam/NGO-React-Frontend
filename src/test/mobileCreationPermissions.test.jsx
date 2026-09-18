import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import Transfers from '../pages/accountManagement/Transfers'
import Income from '../pages/accountManagement/Income'
import Expense from '../pages/accountManagement/Expense'
import Withdrawal from '../pages/accountManagement/Withdrawal'
import Staffs from '../pages/staffs/Staffs'
import AuditReportMeta from '../pages/audit/AuditReportMeta'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))

let setAuth
function AuthControl() {
  setAuth = useSetRecoilState(authDataState)
  return null
}

function mountPage(Page, permissions) {
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { id: 1, permissions })}>
      <AuthControl />
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Page />
        </MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

const pages = [
  [
    Transfers,
    'account_transfer_list_view',
    'account_transfer_registration',
    'account_transfer.Transfer_Registration'
  ],
  [Income, 'income_list_view', 'income_registration', 'income.Income_Registration'],
  [Expense, 'expense_list_view', 'expense_registration', 'expense.Expense_Registration'],
  [
    Withdrawal,
    'account_withdrawal_list_view',
    'account_withdrawal_registration',
    'account_withdrawal.Withdrawal_Registration'
  ],
  [Staffs, 'staff_list_view', 'staff_registration', 'staffs.Staff_Registration'],
  [
    AuditReportMeta,
    'audit_report_meta_list_view',
    'audit_report_meta_create',
    'audit_report_meta.create_meta'
  ]
]

beforeEach(() => {
  window.innerWidth = 390
  xFetch.mockReset()
  xFetch.mockResolvedValue({ success: true, data: [] })
})

describe.each(pages.map(([Page, ...details]) => [Page.name, Page, ...details]))(
  '%s creation permissions',
  (_name, Page, viewGrant, createGrant, label) => {
    it('does not expose mobile creation for a list-only reader', () => {
      mountPage(Page, [viewGrant])
      expect(screen.queryByRole('button', { name: label })).toBeNull()
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('opens permitted creation and removes both form and trigger after revocation', async () => {
      mountPage(Page, [viewGrant, createGrant])
      fireEvent.click(screen.getByRole('button', { name: label }))
      expect(screen.getByRole('dialog')).toBeTruthy()
      act(() => setAuth({ id: 1, permissions: [viewGrant] }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      expect(screen.queryByRole('button', { name: label })).toBeNull()
    })

    it.each([768, 1024])('preserves the existing desktop creation control at %i px', (width) => {
      window.innerWidth = width
      mountPage(Page, [viewGrant])
      expect(screen.getByRole('button', { name: label })).toBeTruthy()
    })
  }
)
