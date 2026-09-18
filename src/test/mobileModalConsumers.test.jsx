import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { RecoilRoot } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import ViewModal from '../components/auditReport/ViewModal'
import FieldFormModal from '../components/field/FieldFormModal'
import ViewClientProfileModal from '../components/pendingReg/ViewClientProfileModal'
import ViewLoanAccountModal from '../components/pendingReg/ViewLoanAccountModal'

vi.unmock('react-i18next')

beforeEach(() => {
  window.innerWidth = 390
  document.execCommand = vi.fn(() => false)
})

async function mount(element, language = 'en') {
  const i18n = createInstance()
  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
  return {
    ...render(
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>{element}</I18nextProvider>
      </RecoilRoot>
    ),
    i18n
  }
}

const report = {
  financial_year: '2025-2026',
  deposit_expenditure: {
    deposit_meta: [],
    expenditure_meta: [],
    total_collections: {},
    total_distributions: {}
  },
  profit_loss: {
    incomes: [],
    expenses: [],
    total_expenses: { net_profits: 0 },
    total_incomes: { net_loss: 0 }
  },
  net_profit: {
    expense_meta: [],
    income_meta: [],
    total_expenses: { total: 0 },
    total_incomes: { total: 0 }
  },
  surplus_value: {
    capital_meta: [],
    resource_meta: [],
    total_capitals: { total: 0 },
    total_resource: { total: 0 }
  },
  client_list: {
    client_list: [{ id: 2, name: 'Rahima Begum', share: 10, savings: 20, loan_remaining: 30 }],
    total_shares: 10,
    total_savings: 20,
    total_loan_remaining: 30
  }
}

describe('mobile modal consumer names and safe dismissal', () => {
  it('names a setup form by its task and dismisses without submitting or changing data', async () => {
    const close = vi.fn()
    const submit = vi.fn()
    const change = vi.fn()
    await mount(
      <FieldFormModal
        open
        setOpen={close}
        error={{}}
        modalTitle="Register field"
        btnTitle="Save"
        t={(key) => key}
        defaultValues={{ name: 'Dhaka', description: '<p>Existing note</p>' }}
        setChange={change}
        loading={{}}
        onSubmit={submit}
      />
    )
    const dialog = screen.getByRole('dialog', { name: 'Register field' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(close).toHaveBeenCalledWith(false)
    expect(submit).not.toHaveBeenCalled()
    expect(change).not.toHaveBeenCalled()
  })

  it('identifies a read-only loan dialog as a loan and updates its accessible name with language', async () => {
    const { i18n } = await mount(
      <ViewLoanAccountModal open setOpen={() => {}} setAccountData={() => {}} />
    )
    const dialog = screen.getByRole('dialog', { name: 'View Loan Account' })
    expect(within(dialog).getByText('View Loan Account')).toBeTruthy()
    expect(within(dialog).queryByText('View Saving Account')).toBeNull()
    await act(() => i18n.changeLanguage('bn'))
    expect(screen.getByRole('dialog', { name: bn.loan.view_loan_acc })).toBeTruthy()
  })

  it('identifies a read-only client profile as a view, not an edit', async () => {
    await mount(<ViewClientProfileModal open setOpen={() => {}} setProfileData={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: 'View Client Profile' })
    expect(within(dialog).getByText('View Client Profile')).toBeTruthy()
    expect(within(dialog).queryByText('Edit Client Profile')).toBeNull()
  })

  it('keeps the existing tablet read-only titles unchanged', async () => {
    window.innerWidth = 768
    await mount(
      <>
        <ViewLoanAccountModal open setOpen={() => {}} setAccountData={() => {}} />
        <ViewClientProfileModal open setOpen={() => {}} setProfileData={() => {}} />
      </>
    )
    expect(screen.getByText('View Saving Account')).toBeTruthy()
    expect(screen.getByText('Edit Client Profile')).toBeTruthy()
    expect(document.querySelector('.mobile-app-dialog')).toBeNull()
  })

  it('provides a visible mobile report title and non-submitting close control outside report content', async () => {
    const close = vi.fn()
    await mount(<ViewModal isOpen setIsOpen={close} data={report} />)
    const dialog = screen.getByRole('dialog', { name: 'Cooperative Audit Report' })
    expect(within(dialog).getByRole('heading', { name: 'Cooperative Audit Report' })).toBeTruthy()
    expect(within(dialog).getByText('Rahima Begum')).toBeTruthy()
    const button = within(dialog).getByRole('button', { name: 'Close' })
    expect(button.type).toBe('button')
    expect(button.closest('.print-report')).toBeNull()
    fireEvent.click(button)
    expect(close).toHaveBeenCalledWith(false)
  })

  it('keeps the desktop report wrapper and printable content without a mobile header', async () => {
    window.innerWidth = 768
    await mount(<ViewModal isOpen setIsOpen={() => {}} data={report} />)
    const wrapper = document.querySelector('.audit-report-view-modal')
    expect(wrapper.className).toBe('audit-report-view-modal bg-white py-5')
    expect(wrapper.style.maxHeight).toBe('90vh')
    expect(wrapper.firstElementChild.classList.contains('print-report')).toBe(true)
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })
})
