import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import PendingClientTransactions from '../pages/pendingClientTransactions/PendingClientTransactions'
import PendingWithdrawal from '../pages/pendingWithdrawals/PendingWithdrawal'
import PendingClosing from '../pages/pendingClosings/PendingClosing'
import xFetch from '../utilities/xFetch'

const fixture = vi.hoisted(() => ({ rowId: 11, data: {}, mutate: vi.fn() }))
vi.mock('../hooks/useFetch', () => ({
  default: ({ action }) => ({
    data: {
      data:
        action === 'users/active'
          ? [
              { id: 1, name: 'Me' },
              { id: 2, name: 'Other collector' }
            ]
          : action.includes('active')
            ? []
            : [{ ...fixture.data, id: fixture.rowId }]
    },
    mutate: fixture.mutate,
    isLoading: false
  })
}))
vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
vi.mock('../helper/deleteAlert', () => ({
  permanentDeleteAlert: () => Promise.resolve({ isConfirmed: true }),
  passwordCheckAlert: () => Promise.resolve({ isConfirmed: true })
}))
vi.mock('../helper/successAlert', () => ({ default: vi.fn() }))

beforeEach(() => {
  fixture.rowId = 11
  const account = {
    client_registration: { id: 1, name: 'Member', acc_no: '101' },
    category: { id: 1, name: 'Standard', is_default: 0 },
    balance: 100
  }
  fixture.data = {
    tx_account: account,
    rx_account: account,
    saving_account: account,
    loan_account: account,
    category: account.category,
    acc_no: '101',
    amount: 10,
    balance: 100,
    balance_remaining: 90,
    is_approved: 0,
    description: '',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z'
  }
  xFetch.mockReset().mockResolvedValue({ success: true, message: 'OK' })
})

function mount(Page, props, permissions, width = 390) {
  window.innerWidth = width
  const wrap = (pageProps) => (
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { id: 1, accessToken: 'test-token', permissions })
        set(windowInnerWidthState, width)
      }}>
      <MemoryRouter>
        <Page {...pageProps} />
      </MemoryRouter>
    </RecoilRoot>
  )
  const view = render(wrap(props))
  return (next) => view.rerender(wrap(next))
}
const row = () => within(document.querySelector('[role="listitem"]'))

describe('Mobile transaction route safety', () => {
  it.each(['saving_to_saving', 'saving_to_loan', 'loan_to_saving', 'loan_to_loan'])(
    'deletes through %s without an intervening approval refresh',
    async (type) => {
      const rerender = mount(
        PendingClientTransactions,
        { type: type === 'saving_to_saving' ? 'loan_to_loan' : 'saving_to_saving' },
        ['pending_client_transactions_delete']
      )
      fixture.rowId = 12
      rerender({ type })
      fireEvent.click(row().getByRole('button', { name: 'common.delete' }))
      await waitFor(() =>
        expect(xFetch).toHaveBeenCalledWith(
          `transactions/delete-transactions/12/${type}`,
          null,
          null,
          'test-token',
          null,
          'DELETE'
        )
      )
    }
  )
  it('preserves the preexisting approval busy behavior at the 768px boundary', () => {
    xFetch.mockReturnValue(new Promise(() => {}))
    mount(
      PendingClientTransactions,
      { type: 'saving_to_saving' },
      ['pending_client_transactions_approval'],
      768
    )
    const control = within(screen.getByRole('table')).getByRole('checkbox', { hidden: true })
    fireEvent.click(control)
    expect(control.disabled).toBe(false)
  })
  it.each(['saving_to_saving', 'saving_to_loan', 'loan_to_saving', 'loan_to_loan'])(
    'uses the current %s route for approval and deletion after navigation',
    async (type) => {
      const rerender = mount(
        PendingClientTransactions,
        { type: type === 'saving_to_saving' ? 'loan_to_loan' : 'saving_to_saving' },
        ['pending_client_transactions_approval', 'pending_client_transactions_delete']
      )
      fixture.rowId = 12
      rerender({ type })
      fireEvent.click(row().getByRole('checkbox', { hidden: true }))
      await waitFor(() =>
        expect(xFetch).toHaveBeenCalledWith(
          `transactions/approve-transactions/12/${type}`,
          null,
          null,
          'test-token',
          null,
          'GET'
        )
      )
      await waitFor(() =>
        expect(row().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
      )
      fireEvent.click(row().getByRole('button', { name: 'common.delete' }))
      await waitFor(() =>
        expect(xFetch).toHaveBeenCalledWith(
          `transactions/delete-transactions/12/${type}`,
          null,
          null,
          'test-token',
          null,
          'DELETE'
        )
      )
    }
  )

  it('disables pending approval and prevents repeated synchronous dispatch until settlement', async () => {
    let finish
    xFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        })
    )
    mount(PendingClientTransactions, { type: 'saving_to_saving' }, [
      'pending_client_transactions_approval'
    ])
    const control = row().getByRole('checkbox', { hidden: true })
    act(() => {
      control.click()
      control.click()
      control.click()
    })
    expect(xFetch).toHaveBeenCalledTimes(1)
    expect(row().getByRole('checkbox', { hidden: true }).disabled).toBe(true)
    await act(async () => finish({ success: true }))
    expect(row().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
    fireEvent.click(row().getByRole('checkbox', { hidden: true }))
    expect(xFetch).toHaveBeenCalledTimes(2)
  })

  it('disables the delete button while its request is unresolved', async () => {
    xFetch.mockReturnValue(new Promise(() => {}))
    mount(PendingClientTransactions, { type: 'saving_to_saving' }, [
      'pending_client_transactions_delete'
    ])
    fireEvent.click(row().getByRole('button', { name: 'common.delete' }))
    await waitFor(() =>
      expect(row().getByRole('button', { name: 'common.delete' }).disabled).toBe(true)
    )
  })
})

describe.each([
  ['saving', 'loan-saving', 'saving', 'loan_saving'],
  ['loan-saving', 'saving', 'loan_saving', 'saving']
])('Withdrawal route %s to %s', (from, to, fromPermission, toPermission) => {
  it('replaces stale delete permission with current update and approval permissions', () => {
    const rerender = mount(PendingWithdrawal, { prefix: from }, [
      `pending_${fromPermission}_withdrawal_delete`,
      `pending_${toPermission}_withdrawal_update`,
      `pending_${toPermission}_withdrawal_approval`
    ])
    expect(row().getByRole('button', { name: 'common.delete' })).toBeTruthy()
    fixture.rowId = 12
    rerender({ prefix: to })
    expect(row().queryByRole('button', { name: 'common.delete' })).toBeNull()
    expect(row().getByRole('button', { name: 'common.edit' })).toBeTruthy()
    expect(row().getByRole('checkbox', { hidden: true })).toBeTruthy()
  })
  it('deletes the newly displayed row through the current endpoint', async () => {
    const rerender = mount(PendingWithdrawal, { prefix: from }, [
      'pending_saving_withdrawal_delete',
      'pending_loan_saving_withdrawal_delete'
    ])
    fixture.rowId = 12
    rerender({ prefix: to })
    fireEvent.click(row().getByRole('button', { name: 'common.delete' }))
    await waitFor(() =>
      expect(xFetch).toHaveBeenCalledWith(
        `withdrawal/${to}/12`,
        null,
        null,
        'test-token',
        null,
        'DELETE'
      )
    )
  })
})

describe.each([
  [
    'saving withdrawal',
    PendingWithdrawal,
    'saving',
    'pending_saving_withdrawal_list_view_as_admin'
  ],
  [
    'loan saving withdrawal',
    PendingWithdrawal,
    'loan-saving',
    'pending_loan_saving_withdrawal_list_view_as_admin'
  ],
  [
    'saving closing',
    PendingClosing,
    'saving',
    'pending_req_to_delete_saving_acc_list_view_as_admin'
  ],
  ['loan closing', PendingClosing, 'loan', 'pending_req_to_delete_loan_acc_list_view_as_admin']
])('%s creator scope', (_name, Page, prefix, permission) => {
  it.each([390, 767])('offers other creators to the workflow admin at %i px', (width) => {
    mount(Page, { prefix }, [permission], width)
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'common.creator' }))
    expect(screen.getByRole('option', { name: 'Other collector' })).toBeTruthy()
  })
  it('does not show the creator filter to ordinary viewers', () => {
    mount(Page, { prefix }, [permission.replace('_as_admin', '')])
    expect(screen.queryByRole('combobox', { name: 'common.creator' })).toBeNull()
  })
  it('preserves the existing creator restriction at 768px', () => {
    mount(Page, { prefix }, [permission], 768)
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'common.creator' }))
    expect(screen.queryByRole('option', { name: 'Other collector' })).toBeNull()
    expect(screen.getByRole('option', { name: 'Me' })).toBeTruthy()
  })
})
