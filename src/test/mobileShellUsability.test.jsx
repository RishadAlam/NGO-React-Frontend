import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Link, MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import MobilePageHeader from '../components/mobile/MobilePageHeader'

vi.unmock('react-i18next')
vi.mock('recoil-nexus', () => ({ getRecoil: () => ({ permissions: [] }) }))

let i18n
beforeEach(async () => {
  window.innerWidth = 390
  window.history.replaceState({}, '', '/')
  i18n = createInstance()
  await i18n.init({
    lng: 'en',
    fallbackLng: false,
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
})

function Shell() {
  const location = useLocation()
  return (
    <>
      <MobilePageHeader onMenuOpen={() => {}} />
      <output aria-label="Current route">{location.pathname}</output>
      <Link to="/analytics">Open analytics</Link>
    </>
  )
}

function mountMemory(path) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[path]}>
        <Shell />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('Mobile shell entry navigation', () => {
  it('shows only the current page name without a second group-title row', () => {
    mountMemory('/registration/client')
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe(i18n.t('menu.registration.Client_Registration'))
    expect(heading.parentElement.textContent).toBe(heading.textContent)
  })

  it('returns a directly opened page to Services without leaving the app', () => {
    mountMemory('/analytics')
    fireEvent.click(screen.getByRole('button', { name: i18n.t('mobile.back') }))
    expect(screen.getByLabelText('Current route').textContent).toBe('/services')
  })

  it('uses Services when unrelated browser history exists before the app entry', async () => {
    window.history.pushState({}, '', '/previous-document')
    window.history.pushState({}, '', '/analytics')
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </I18nextProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: i18n.t('mobile.back') }))
    await waitFor(() =>
      expect(screen.getByLabelText('Current route').textContent).toBe('/services')
    )
  })

  it('keeps the actual preceding in-app route instead of always returning Services', () => {
    mountMemory('/fields')
    fireEvent.click(screen.getByRole('link', { name: 'Open analytics' }))
    fireEvent.click(screen.getByRole('button', { name: i18n.t('mobile.back') }))
    expect(screen.getByLabelText('Current route').textContent).toBe('/fields')
  })
})

describe.each(['en', 'bn'])('Original mobile page names in %s', (language) => {
  it.each([
    ['/client-register/42', 'Client Register', 'সদস্য রেজিস্টার'],
    ['/saving-account/42', 'Saving Account', 'সঞ্চয় অ্যাকাউন্ট'],
    ['/loan-account/42', 'Loan Account', 'ঋণ অ্যাকাউন্ট'],
    ['/staff-permissions/42', 'Staff Permissions', 'অফিসার অনুমতি'],
    ['/role-permissions/42', 'Role Permissions', 'ভূমিকার অনুমতি'],
    ['/dashboard/loan-given', 'Loan Given', 'ঋণ দেওয়া হয়েছে'],
    ['/dashboard/loan-recovered', 'Loan Make Collections', 'ঋণ কালেকশন হয়েছে'],
    ['/dashboard/loan-saving', 'Loan Saving Make Collections', 'ঋণ সঞ্চয় কালেকশন হয়েছে'],
    ['/dashboard/monthly-loan', 'Monthly Loan Make Collections', 'মাসিক ঋণ কালেকশন হয়েছে'],
    ['/dashboard/saving-collections', 'Saving Make Collections', 'সঞ্চয় কালেকশন হয়েছে'],
    ['/dashboard/dps-collections', 'DPS Make Collections', 'ডিপিএস কালেকশন হয়েছে']
  ])('uses the existing translated page title for %s', async (path, english, bengali) => {
    await i18n.changeLanguage(language)
    mountMemory(path)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      language === 'en' ? english : bengali
    )
  })
})
