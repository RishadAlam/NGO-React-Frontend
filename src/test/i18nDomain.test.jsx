import { act, fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import Cookies from 'js-cookie'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { RecoilRoot } from 'recoil'
import { afterEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import PrintReportView from '../components/auditReport/PrintReportView'
import NomiesDetails from '../components/register/NomiesDetails'
import RegisterProfileBox from '../components/register/RegisterProfileBox'
import ResetPassword from '../components/resetPassword/ResetPassword'
import OtpVerification from '../components/otpVerification/OtpVerification'

vi.unmock('react-i18next')
afterEach(() => {
  Cookies.remove('i18next')
  vi.useRealTimers()
})

async function mount(element, language = 'bn') {
  const i18n = createInstance()
  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
  Cookies.set('i18next', language)
  const result = render(
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>{element}</I18nextProvider>
    </RecoilRoot>
  )
  return { ...result, i18n }
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
    total_expenses: { net_profits: 5 },
    total_incomes: { net_loss: 0 }
  },
  net_profit: {
    expense_meta: [],
    income_meta: [],
    total_expenses: { total: 5 },
    total_incomes: { total: 5 }
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

describe('Domain screens use the selected real language', () => {
  it('switches printed report headings and signatories without translating member data', async () => {
    const { i18n } = await mount(<PrintReportView data={report} />, 'en')
    expect(screen.getByRole('columnheader', { name: 'Member no.' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { name: 'Secretary' })).toHaveLength(5)
    expect(screen.getByText('Rahima Begum')).toBeTruthy()
    Cookies.set('i18next', 'bn')
    await act(() => i18n.changeLanguage('bn'))
    expect(screen.getByRole('columnheader', { name: 'সদস্য নং' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { name: 'সম্পাদক' })).toHaveLength(5)
    expect(screen.getByText('Rahima Begum')).toBeTruthy()
  })

  it('translates known gender values while retaining member names and free-form occupation', async () => {
    const { i18n } = await mount(
      <NomiesDetails
        status="saving"
        data={{ name: 'Rahima', gender: 'female', occupation: 'Tailor' }}
      />
    )
    expect(screen.getByText('মহিলা')).toBeTruthy()
    expect(screen.getByText('Rahima')).toBeTruthy()
    expect(screen.getByText('Tailor')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'স্বাক্ষর' })).toBeTruthy()
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Female')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Signature' })).toBeTruthy()
  })

  it('provides translated member-photo alternative text', async () => {
    await mount(<RegisterProfileBox name="Rahima" acc_no="123" image_uri="/portrait.jpg" />)
    expect(screen.getByRole('img', { name: 'ছবি' })).toBeTruthy()
  })

  it('keeps a visible password-mismatch error translated when switching languages', async () => {
    const { container, i18n } = await mount(
      <ResetPassword userId={1} loading={{}} setLoading={() => {}} />
    )
    const fields = container.querySelectorAll('input[type="password"]')
    fireEvent.change(fields[1], { target: { value: 'Different123!' } })
    expect(screen.getByText('পাসওয়ার্ড দুটি মেলেনি।')).toBeTruthy()
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Passwords do not match.')).toBeTruthy()
  })

  it('localizes the OTP timer unit and each digit field label', async () => {
    vi.useFakeTimers()
    const { i18n } = await mount(
      <OtpVerification userId={1} loading={{}} setLoading={() => {}} setStep={() => {}} />
    )
    expect(screen.getByLabelText('যাচাইকরণ কোডের ১ নম্বর ঘর')).toBeTruthy()
    expect(screen.getByText('৩০ সেকেন্ড')).toBeTruthy()
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByLabelText('Verification code digit 1')).toBeTruthy()
    expect(screen.getByText('30 seconds')).toBeTruthy()
    for (let second = 0; second < 29; second += 1) {
      act(() => vi.advanceTimersByTime(1000))
    }
    expect(screen.getByText('1 second')).toBeTruthy()
  })
})
