import { fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import Cookies from 'js-cookie'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { afterEach, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import MobileBottomNav from '../components/mobile/MobileBottomNav'
import { authDataState } from '../atoms/authAtoms'

vi.unmock('react-i18next')

afterEach(() => {
  Cookies.remove('i18next')
  Cookies.remove('isDark')
  document.body.className = ''
})

it.each([
  ['en', 'Dashboard', 'Search', 'All services', 'Theme', 'Language: Eng', 'BN', 'Profile'],
  ['bn', 'ড্যাশবোর্ড', 'অনুসন্ধান করুন', 'সব সেবা', 'থিম', 'ভাষা: বাংলা', 'বাং', 'প্রোফাইল']
])(
  'keeps the icon-only dock accessible in %s',
  async (language, home, search, services, theme, languageLabel, badge, profile) => {
    window.innerWidth = 390
    Cookies.set('i18next', language)
    Cookies.set('isDark', 'false')
    const i18n = createInstance()
    await i18n.init({
      lng: language,
      resources: { en: { translation: en }, bn: { translation: bn } },
      interpolation: { escapeValue: false }
    })
    render(
      <I18nextProvider i18n={i18n}>
        <RecoilRoot
          initializeState={({ set }) =>
            set(authDataState, { name: 'Employee', role: ['Officer'] })
          }>
          <MemoryRouter initialEntries={['/services']}>
            <MobileBottomNav />
          </MemoryRouter>
        </RecoilRoot>
      </I18nextProvider>
    )

    for (const [name, path] of [
      [home, '/dashboard'],
      [search, '/search'],
      [services, '/services']
    ]) {
      const link = screen.getByRole('link', { name, exact: true })
      expect(link.getAttribute('href')).toBe(path)
      expect(link.textContent).toBe('')
    }
    expect(screen.getByRole('link', { name: services }).getAttribute('aria-current')).toBe('page')
    const themeButton = screen.getByRole('button', { name: theme, exact: true })
    expect(themeButton.textContent).toBe('')
    fireEvent.click(themeButton)
    expect(themeButton.getAttribute('aria-pressed')).toBe('true')
    const languageButton = screen.getByRole('button', { name: languageLabel, exact: true })
    expect(languageButton.textContent).toBe(`EN${badge}`)
    expect(languageButton.getAttribute('aria-pressed')).toBe(String(language === 'bn'))
    const profileButton = screen.getByRole('button', { name: profile, exact: true })
    expect(profileButton.textContent).toBe('')
    expect(profileButton.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(profileButton)
    expect(profileButton.getAttribute('aria-expanded')).toBe('true')
    const profileLink = screen.getByRole('link', { name: profile, exact: true })
    expect(profileLink.getAttribute('href')).toBe('/profile')
    fireEvent.click(profileLink)
    expect(profileButton.getAttribute('aria-expanded')).toBe('false')
  }
)
