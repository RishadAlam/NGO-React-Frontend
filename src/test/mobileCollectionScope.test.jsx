import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import SavingForm from '../components/collection/SavingCollectionModal'
import LoanForm from '../components/collection/LoanCollectionModal'
import SavingHistory from '../components/savingAccount/SavingCollections'
import LoanHistory from '../components/loanAccount/LoanCollections'
import SavingRow from '../components/collection/SavingCollectionSheetRow'
import LoanRow from '../components/collection/LoanCollectionSheetRow'
import SavingFooter from '../components/collection/SavingCollectionSheetFooter'
import LoanFooter from '../components/collection/LoanCollectionSheetFooter'
import useFetch from '../hooks/useFetch'
import xFetch from '../utilities/xFetch'

vi.mock('../hooks/useFetch', () => ({ default: vi.fn() }))
vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
vi.mock('../helper/deleteAlert', () => ({
  permanentDeleteAlert: () => Promise.resolve({ isConfirmed: true }),
  passwordCheckAlert: () => Promise.resolve({ isConfirmed: true })
}))
vi.mock('../components/utilities/TextAreaInputField', () => ({
  default: () => <textarea aria-label="Description" />
}))

const collection = {
  id: 9,
  collection_id: 9,
  newCollection: false,
  saving_account_id: 3,
  loan_account_id: 4,
  field_id: 1,
  center_id: 2,
  category_id: 3,
  client_registration_id: 5,
  account_id: 1,
  acc_no: 42,
  name: 'Member',
  installment: 1,
  deposit: 100,
  loan: 20,
  interest: 5,
  total: 125,
  description: '',
  is_approved: false,
  is_loan_approved: 1,
  client_registration: { name: 'Member' },
  saving_account: { payable_deposit: 100 },
  loan_account: {
    payable_deposit: 100,
    loan_installment: 20,
    interest_installment: 5,
    is_loan_approved: 1
  },
  account: { id: 1, name: 'Cash', is_default: 0 },
  created_at: '2026-01-15 12:00:00',
  updated_at: '2026-01-15 12:00:00',
  approved_at: '2026-01-15 12:00:00'
}
const account = { id: 3, acc_no: 42, payable_deposit: 100, client_registration: { name: 'Member' } }

function mount(element, permissions, width = 390) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => set(authDataState, { permissions, accessToken: 'test-token' })}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {element}
      </MemoryRouter>
    </RecoilRoot>
  )
}

beforeEach(() => {
  xFetch.mockReset()
  xFetch.mockResolvedValue({ success: true, message: 'Saved' })
  useFetch.mockImplementation(({ action }) => ({
    data: { data: action.startsWith('collection/') ? [collection] : [collection.account] },
    mutate: vi.fn(),
    isLoading: false
  }))
})

describe.each([
  ['saving', SavingForm, SavingHistory, SavingRow, SavingFooter],
  ['loan', LoanForm, LoanHistory, LoanRow, LoanFooter]
])('Mobile %s collection request scope', (kind, Form, History, Row, Footer) => {
  it('opens account-history editing with only its account-specific update permission', () => {
    mount(<History />, [`client_${kind}_account_collection_update`])
    fireEvent.click(screen.getByRole('button', { name: 'common.edit' }))
    expect(screen.getByRole('dialog', { name: 'common.edit_collection' })).toBeTruthy()
  })

  it('keeps the original account ID when submitting a mobile account-history edit', async () => {
    mount(<History />, [`client_${kind}_account_collection_update`])
    fireEvent.click(screen.getByRole('button', { name: 'common.edit' }))
    fireEvent.submit(screen.getByRole('button', { name: 'common.edit_collection' }).closest('form'))
    await waitFor(() => {
      const request = xFetch.mock.calls.find(([endpoint]) => endpoint === `collection/${kind}/9`)
      expect(request).toBeTruthy()
      expect(request[1].get(`${kind}_account_id`)).toBe(kind === 'saving' ? '3' : '4')
    })
  })

  it('preserves the existing desktop history payload mapping', async () => {
    mount(<History />, [`client_${kind}_account_collection_update`], 768)
    fireEvent.click(screen.getByRole('button', { name: 'common.edit' }))
    fireEvent.submit(screen.getByRole('button', { name: 'common.posting' }).closest('form'))
    await waitFor(() => {
      const request = xFetch.mock.calls.find(([endpoint]) => endpoint === `collection/${kind}/9`)
      expect(request).toBeTruthy()
      expect(request[1].get(`${kind}_account_id`)).toBe(kind === 'saving' ? '9' : '4')
    })
  })

  it('does not open an account-history form with only a pending grant', () => {
    mount(
      <Form
        open
        setOpen={() => {}}
        collectionData={collection}
        mutate={() => {}}
        isRegular={false}
        scope="account"
      />,
      [`pending_${kind}_collection_update`]
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it.each([
    ['regular', 'regular'],
    ['pending', 'pending'],
    ['account', 'client']
  ])('passes the exact %s update context to the request boundary', async (scope, prefix) => {
    const grant =
      prefix === 'client'
        ? `client_${kind}_account_collection_update`
        : `${prefix}_${kind}_collection_update`
    mount(
      <Form
        open
        setOpen={() => {}}
        collectionData={collection}
        mutate={() => {}}
        isRegular={scope === 'regular'}
        scope={scope}
      />,
      [grant]
    )
    fireEvent.submit(screen.getByRole('button', { name: 'common.edit_collection' }).closest('form'))
    await waitFor(() =>
      expect(xFetch).toHaveBeenCalledWith(
        `collection/${kind}/9`,
        expect.any(FormData),
        null,
        'test-token',
        null,
        'POST',
        true,
        { mobilePermission: grant }
      )
    )
  })

  it('does not treat an account grant as pending update access', () => {
    mount(
      <Form
        open
        setOpen={() => {}}
        collectionData={collection}
        mutate={() => {}}
        isRegular={false}
        scope="pending"
      />,
      [`client_${kind}_account_collection_update`]
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('keeps the desktop account-history form behavior unchanged', () => {
    mount(
      <Form
        open
        setOpen={() => {}}
        collectionData={collection}
        mutate={() => {}}
        isRegular={false}
        scope="account"
      />,
      [],
      768
    )
    expect(screen.getByRole('button', { name: 'common.posting' })).toBeTruthy()
  })

  it('passes account-history deletion context through the confirmation helper', async () => {
    mount(<History />, [`client_${kind}_account_collection_permanently_delete`])
    fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
    await waitFor(() =>
      expect(xFetch).toHaveBeenCalledWith(
        `collection/${kind}/force-delete/9`,
        null,
        null,
        'test-token',
        null,
        'DELETE',
        false,
        { mobilePermission: `client_${kind}_account_collection_permanently_delete` }
      )
    )
  })

  it.each([true, false])(
    'passes the correct sheet deletion context (regular=%s)',
    async (isRegular) => {
      const grant = `${isRegular ? 'regular' : 'pending'}_${kind}_collection_permanently_delete`
      mount(
        <table>
          <tbody>
            <Row
              columnList={{}}
              account={account}
              collection={collection}
              approvedList={[]}
              setApprovedList={() => {}}
              mutate={() => {}}
              isRegular={isRegular}
              isMobileSheet
            />
          </tbody>
        </table>,
        [grant]
      )
      fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
      await waitFor(() =>
        expect(xFetch).toHaveBeenCalledWith(
          `collection/${kind}/force-delete/9`,
          null,
          null,
          'test-token',
          null,
          'DELETE',
          false,
          { mobilePermission: grant }
        )
      )
    }
  )

  it.each([true, false])(
    'passes the correct bulk approval context (regular=%s)',
    async (isRegular) => {
      const grant = `${isRegular ? 'regular' : 'pending'}_${kind}_collection_approval`
      mount(
        <table>
          <Footer
            columnList={{}}
            center={{}}
            approvedList={[9]}
            setApprovedList={() => {}}
            mutate={() => {}}
            isRegular={isRegular}
          />
        </table>,
        [grant]
      )
      fireEvent.click(screen.getByRole('button', { name: 'common.approval' }))
      await waitFor(() =>
        expect(xFetch).toHaveBeenCalledWith(
          `collection/${kind}/approved`,
          { approvedList: [9] },
          null,
          'test-token',
          null,
          'POST',
          false,
          { mobilePermission: grant }
        )
      )
    }
  )
})
