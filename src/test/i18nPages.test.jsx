import { act, fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Category from '../pages/category/Category'
import ForgotPassword from '../pages/forgotPassword/ForgotPassword'
import Login from '../pages/login/Login'
import Analytics from '../pages/analytics/Analytics'
import PendingLoans from '../pages/pendingLoans/PendingLoans'
import StaffPermissions from '../pages/staffs/StaffPermissions'

vi.unmock('react-i18next')
const fixtures = vi.hoisted(() => ({
  categories: [{ id: 7, name: 'Daily savings', status: 1, group: 'Daily', description: '' }],
  loans: [
    {
      id: 7,
      start_date: new Date().toISOString(),
      acc_no: '1001',
      loan_given: 5000,
      category: { is_default: 1, name: 'monthly_loan' },
      client_registration: { name: 'Member', image_uri: null },
      field: { name: 'Field' },
      center: { name: 'Center' },
      author: { name: 'Staff' }
    }
  ],
  staffPermissions: {
    allPermissions: [],
    user: {
      id: 42,
      name: 'Staff Member',
      email: 'staff@example.com',
      status: 1,
      roles: ['field_officer', 'North Branch_Lead', { name: 'admin' }, { name: 'CUSTOM Role' }]
    },
    userPermissions: [],
    userDirectPermissions: [],
    userRolePermissions: []
  },
  empty: []
}))
vi.mock('../hooks/useFetch', () => ({
  default: ({ action }) => ({
    data: {
      data:
        action === 'categories'
          ? fixtures.categories
          : action === 'client/registration/loan/pending-loans'
            ? fixtures.loans
            : action.startsWith('permissions/')
              ? fixtures.staffPermissions
              : fixtures.empty
    },
    isLoading: false,
    mutate: vi.fn()
  })
}))

async function mount(Page) {
  window.innerWidth = 390
  const i18n = createInstance()
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
  render(
    <I18nextProvider i18n={i18n}>
      <RecoilRoot
        initializeState={({ set }) => {
          set(authDataState, { permissions: ['category_data_update'], accessToken: 'Bearer test' })
          set(windowInnerWidthState, 390)
        }}>
        <MemoryRouter>
          <Page />
        </MemoryRouter>
      </RecoilRoot>
    </I18nextProvider>
  )
  return i18n
}

describe('Page language switching', () => {
  it('updates action labels in memoized page tables without remounting', async () => {
    const i18n = await mount(Category)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(screen.getByRole('button', { name: 'সম্পাদনা করুন' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
  })

  it('keeps an already-visible validation message in the selected language', async () => {
    const i18n = await mount(ForgotPassword)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'invalid' } })
    expect(screen.getByText('Enter a valid Email.')).toBeTruthy()
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(screen.getByText('ইমেইল সঠিকভাবে লিখুন।')).toBeTruthy()
    expect(screen.queryByText('Enter a valid Email.')).toBeNull()
  })

  it('updates the login browser title when the language changes', async () => {
    const i18n = await mount(Login)
    expect(document.title).toBe('Sign in')
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(document.title).toBe(bn.auth.sign_in)
  })

  it('updates a selected approval label without changing its selected value', async () => {
    const i18n = await mount(Analytics)
    const approval = screen.getByDisplayValue('All')
    fireEvent.change(approval, { target: { value: 'Approved' } })
    fireEvent.keyDown(approval, { key: 'ArrowDown' })
    fireEvent.keyDown(approval, { key: 'Enter' })
    expect(screen.getByDisplayValue('Approved')).toBeTruthy()
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(screen.getByDisplayValue('অনুমোদিত')).toBeTruthy()
    expect(screen.queryByDisplayValue('Approved')).toBeNull()
  })

  it('refreshes the default loan category in calendar events on language change', async () => {
    const i18n = await mount(PendingLoans)
    expect(screen.getByText(/^Monthly Loan \(/)).toBeTruthy()
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(screen.getByText(/^মাসিক ঋণ \(/)).toBeTruthy()
    expect(screen.queryByText(/^Monthly Loan \(/)).toBeNull()
  })

  it('translates default roles in either API shape without altering custom names', async () => {
    const i18n = await mount(StaffPermissions)
    expect(screen.getByText('Field Officer, North Branch_Lead, Admin, CUSTOM Role')).toBeTruthy()
    await act(async () => {
      await i18n.changeLanguage('bn')
    })
    expect(screen.getByText('মাঠকর্মী, North Branch_Lead, অ্যাডমিন, CUSTOM Role')).toBeTruthy()
    expect(fixtures.staffPermissions.user.roles).toEqual([
      'field_officer',
      'North Branch_Lead',
      { name: 'admin' },
      { name: 'CUSTOM Role' }
    ])
  })
})
