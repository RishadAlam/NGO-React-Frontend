import { useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { HelmetProvider } from 'react-helmet-async'
import { SWRConfig, unstable_serialize } from 'swr'
import ApprovalConfigs from '../components/approvalConfigs/ApprovalConfigs'
import TransferTransactionConfig from '../components/approvalConfigs/TransferTransactionConfig'
import ProfileBox from '../components/profileBox/ProfileBox'
import { beforeEach, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Login from '../pages/login/Login'
import ForgotPassword from '../pages/forgotPassword/ForgotPassword'
import OtpVerification from '../components/otpVerification/OtpVerification'
import ResetPassword from '../components/resetPassword/ResetPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import Analytics from '../pages/analytics/Analytics'
import ApprovalsConfig from '../pages/configurations/ApprovalsConfig'
import CategoriesConfig from '../pages/configurations/CategoriesConfig'
import RegisteredClientAccountList from '../pages/registeredAccountList/RegisteredClientAccountList'
import RegisteredLoanAccountList from '../pages/registeredAccountList/RegisteredLoanAccountList'
import RegisteredSavingAccountList from '../pages/registeredAccountList/RegisteredSavingAccountList'
import Accounts from '../pages/accountManagement/Accounts'
import Income from '../pages/accountManagement/Income'
import Expense from '../pages/accountManagement/Expense'
import Transfers from '../pages/accountManagement/Transfers'
import Transactions from '../pages/accountManagement/Transactions'
import Withdrawal from '../pages/accountManagement/Withdrawal'
import IncomeCategories from '../pages/accountManagement/IncomeCategories'
import ExpenseCategories from '../pages/accountManagement/ExpenseCategories'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
beforeEach(() => {
  window.innerWidth = 390
  xFetch.mockReset()
})
function mount(element, width = 390, fallback = {}) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, {
          id: 1,
          name: 'Member',
          role: ['manager'],
          permissions: [],
          accessToken: 'session'
        })
        set(windowInnerWidthState, width)
      }}>
      <HelmetProvider>
        <SWRConfig
          value={{
            provider: () => new Map(),
            shouldRetryOnError: false,
            dedupingInterval: 0,
            fallback
          }}>
          <MemoryRouter>{element}</MemoryRouter>
        </SWRConfig>
      </HelmetProvider>
    </RecoilRoot>
  )
}
function Stateful({ Component }) {
  const [loading, setLoading] = useState({})
  return (
    <Component
      userId={7}
      resetToken={'a'.repeat(64)}
      loading={loading}
      setLoading={setLoading}
      setStep={() => {}}
    />
  )
}
it.each([390, 768])('normalizes pasted Bangla OTP only on mobile (%i)', (width) => {
  mount(<Stateful Component={OtpVerification} />, width)
  fireEvent.paste(screen.getAllByRole('textbox')[0], { clipboardData: { getData: () => '১২৩৪৫৬' } })
  expect(
    screen
      .getAllByRole('textbox')
      .map((i) => i.value)
      .join('')
  ).toBe(width < 768 ? '123456' : '')
})
it('normalizes typed Bangla OTP and preserves the verification payload', async () => {
  xFetch.mockResolvedValue({ success: false, message: 'Invalid code' })
  const { container } = mount(<Stateful Component={OtpVerification} />)
  for (const [index, digit] of [...'১২৩৪৫৬'].entries())
    fireEvent.change(screen.getAllByRole('textbox')[index], { target: { value: digit } })
  expect(
    screen
      .getAllByRole('textbox')
      .map((input) => input.value)
      .join('')
  ).toBe('123456')
  fireEvent.submit(container.querySelector('form'))
  await screen.findByText('Invalid code')
  expect(xFetch.mock.calls[0][0]).toBe('account-verification')
  expect(xFetch.mock.calls[0][1]).toEqual({ otp: '123456', user_id: 7, purpose: 'verification' })
  expect(xFetch.mock.calls[0][5]).toBe('POST')
})
it.each([Login, ForgotPassword])(
  'lets mobile auth retry generic errors without dropping credentials (%s)',
  async (Component) => {
    xFetch.mockResolvedValue({ success: false, status: 400, message: 'Unavailable' })
    const { container } = mount(<Component />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'member@example.com' } })
    if (Component === Login)
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.submit(container.querySelector('form'))
    await screen.findByText('Unavailable')
    expect(container.querySelector('[type=submit]').disabled).toBe(false)
    expect(screen.getByLabelText('Email').value).toBe('member@example.com')
  }
)
it('blocks same-tick duplicate login submits and retains server field validation', async () => {
  let resolve
  xFetch.mockImplementation(
    () =>
      new Promise((r) => {
        resolve = r
      })
  )
  const { container } = mount(<Login />)
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'member@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
  act(() => {
    fireEvent.submit(container.querySelector('form'))
    fireEvent.submit(container.querySelector('form'))
  })
  expect(xFetch.mock.calls).toHaveLength(1)
  await act(async () => resolve({ success: false, errors: { email: 'Invalid email' } }))
  expect(container.querySelector('[type=submit]').disabled).toBe(true)
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'correct@example.com' } })
  expect(container.querySelector('[type=submit]').disabled).toBe(false)
})
it.each([ForgotPassword, OtpVerification, ResetPassword])(
  'releases rejected mobile recovery requests (%s)',
  async (Component) => {
    let reject
    xFetch.mockImplementation(
      () =>
        new Promise((_resolve, r) => {
          reject = r
        })
    )
    const { container } = mount(
      Component === ForgotPassword ? <Component /> : <Stateful Component={Component} />
    )
    if (Component === ForgotPassword)
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'member@example.com' } })
    if (Component === OtpVerification)
      fireEvent.paste(screen.getAllByRole('textbox')[0], {
        clipboardData: { getData: () => '123456' }
      })
    if (Component === ResetPassword) {
      fireEvent.change(screen.getByLabelText('auth.new_password'), {
        target: { value: 'Goodpass1!' }
      })
      fireEvent.change(screen.getByLabelText('auth.confirm_password'), {
        target: { value: 'Goodpass1!' }
      })
    }
    fireEvent.submit(container.querySelector('form'))
    expect(container.querySelector('[type=submit]').disabled).toBe(true)
    await act(async () => reject(new Error('Offline')))
    await screen.findByText('Offline')
    expect(container.querySelector('[type=submit]').disabled).toBe(false)
  }
)
const pages = [
  Dashboard,
  Analytics,
  ApprovalsConfig,
  CategoriesConfig,
  RegisteredClientAccountList,
  RegisteredLoanAccountList,
  RegisteredSavingAccountList,
  Accounts,
  Income,
  Expense,
  Transfers,
  Transactions,
  Withdrawal,
  IncomeCategories,
  ExpenseCategories
]
it.each([390, 768])(
  'sanitizes mobile server exceptions without changing desktop (%i)',
  async (width) => {
    xFetch.mockRejectedValue({
      status: 500,
      message: 'SMTP 550 secret server path',
      errors: { message: 'SMTP 550 secret server path' }
    })
    const { container } = mount(<Login />, width)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'member@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.submit(container.querySelector('form'))
    await screen.findByText(
      width < 768 ? 'localization.shared.unexpected_error' : 'SMTP 550 secret server path'
    )
    expect(Boolean(screen.queryByText('SMTP 550 secret server path'))).toBe(width >= 768)
  }
)
it.each([390, 768])('hides the unregistered password route on phones only (%i)', (width) => {
  const { container } = mount(<ProfileBox t={(key) => key} variant="dock" />, width)
  if (width < 768) fireEvent.click(screen.getByRole('button', { name: 'profile_box.profile' }))
  expect(Boolean(container.querySelector('a[href="/change-password"]'))).toBe(width >= 768)
})
it.each([ApprovalConfigs, TransferTransactionConfig])(
  'keeps mobile settings update retryable after a generic error (%s)',
  async (Component) => {
    xFetch.mockImplementation((_a, _b, _c, _d, _e, method) =>
      Promise.resolve(method === 'PUT' ? { success: false, message: 'Unavailable' } : { data: [] })
    )
    mount(
      <Component
        allApprovals={[{ id: 1, meta_key: 'client_reg_fee', meta_value: 10 }]}
        accTransferConfigs={{
          saving_to_saving: {
            approval_required: 1,
            fee: 5,
            fee_store_acc_id: 0,
            min: 1,
            max: 100,
            account: null
          }
        }}
        isLoading={false}
        mutate={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'common.update' }))
    await screen.findByText('Unavailable')
    expect(screen.getByRole('button', { name: 'common.update' }).disabled).toBe(false)
  }
)
it('keeps successful cached data visible with a stale warning', async () => {
  xFetch.mockRejectedValue(new Error('Offline'))
  const key = unstable_serialize(['accounts', null])
  const { container } = mount(<Accounts />, 390, { [key]: { data: [] } })
  await screen.findByText('mobile.stale_data')
  expect(container.querySelector('.react-table-card')).not.toBeNull()
})
it.each(pages)('leaves desktop error handling unchanged (%s)', async (Page) => {
  xFetch.mockRejectedValue(new Error('Offline'))
  mount(<Page pageTitle="menu.dashboard" />, 768)
  await act(async () => {})
  expect(screen.queryByText('mobile.load_error')).toBeNull()
})
it.each(pages)(
  'shows mobile initial failure and retries into successful empty data (%s)',
  async (Page) => {
    xFetch.mockImplementation((action) =>
      action.endsWith('/active')
        ? Promise.resolve({ data: [] })
        : Promise.reject(new Error('Offline'))
    )
    const { container } = mount(<Page pageTitle="menu.dashboard" />)
    await screen.findByText('mobile.load_error')
    expect(container.querySelector('.react-table-card, .dashboard-grid')).toBeNull()
    xFetch.mockResolvedValue({ data: [] })
    fireEvent.click(screen.getByRole('button', { name: 'mobile.retry' }))
    await waitFor(() => expect(screen.queryByText('mobile.load_error')).toBeNull())
    if (Page === ApprovalsConfig) expect(container.querySelector('.MuiSkeleton-root')).toBeNull()
  }
)
