import { fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Link, MemoryRouter, useLocation } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { beforeEach, describe, expect, it } from 'vitest'
import { appSettingsState } from '../atoms/appSettingsAtoms'
import { authDataState } from '../atoms/authAtoms'
import ProfileBox from '../components/profileBox/ProfileBox'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import { vi } from 'vitest'

vi.unmock('react-i18next')

let i18n
beforeEach(async () => {
  window.innerWidth = 390
  i18n = createInstance()
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } },
    interpolation: { escapeValue: false }
  })
})

function RouteMarker() {
  return <output aria-label="Current route">{useLocation().pathname}</output>
}

function renderProfile({ settings, repeat = false } = {}) {
  return render(
    <I18nextProvider i18n={i18n}>
      <RecoilRoot
        initializeState={({ set }) => {
          set(authDataState, { name: 'Amina Rahman', role: ['Field Officer'] })
          if (settings) set(appSettingsState, settings)
        }}>
        <MemoryRouter>
          <ProfileBox t={i18n.t.bind(i18n)} variant="dock" />
          {repeat && <ProfileBox t={i18n.t.bind(i18n)} variant="dock" />}
          <Link to="/other">Other route</Link>
          <RouteMarker />
        </MemoryRouter>
      </RecoilRoot>
    </I18nextProvider>
  )
}

describe('mobile dock profile disclosure', () => {
  it.each([
    ['en', 'Profile', 'Change Password', 'Logout', 'Template'],
    ['bn', 'প্রোফাইল', 'পাসওয়ার্ড পরিবর্তন করুন', 'প্রস্থান', 'টেমপ্লেট']
  ])(
    'exposes account actions and palette access in %s',
    async (language, profile, password, logout, palette) => {
      await i18n.changeLanguage(language)
      const { container } = renderProfile({ settings: { company_name: 'Community Cooperative' } })
      const trigger = screen.getByRole('button', { name: profile })
      expect(trigger.className).toContain('mobile-bottom-nav__item')
      expect(trigger.querySelector('.MuiAvatar-root')).toBe(null)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(screen.queryByRole('link', { name: profile })).toBe(null)
      expect(screen.queryByRole('combobox', { name: palette })).toBe(null)
      fireEvent.click(trigger)
      const profileLink = screen.getByRole('link', { name: profile })
      expect(profileLink.getAttribute('href')).toBe('/profile')
      expect(screen.queryByRole('link', { name: password })).toBe(null)
      expect(screen.getByRole('button', { name: logout })).toBeTruthy()
      expect(screen.getByRole('combobox', { name: palette }).options.length).toBeGreaterThan(1)
      expect(screen.getByText('Amina Rahman')).toBeTruthy()
      expect(screen.getByText('Field Officer')).toBeTruthy()
      expect(screen.getByText('Community Cooperative')).toBeTruthy()
      expect(document.activeElement).toBe(profileLink)
      expect(document.getElementById(trigger.getAttribute('aria-controls'))).toBeTruthy()
      expect(container.querySelector('[role="menu"]')).toBe(null)
    }
  )

  it('dismisses with Escape and restores focus to the dock trigger', () => {
    renderProfile()
    const trigger = screen.getByRole('button', { name: 'Profile' })
    fireEvent.click(trigger)
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Profile' }))
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    expect(screen.queryByRole('combobox', { name: 'Template' })).toBe(null)
  })

  it('dismisses outside presses while allowing interaction inside the disclosure', () => {
    renderProfile()
    const trigger = screen.getByRole('button', { name: 'Profile' })
    fireEvent.click(trigger)
    fireEvent.pointerDown(screen.getByRole('combobox', { name: 'Template' }))
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    fireEvent.pointerDown(document.body)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes after account navigation and after unrelated route changes', () => {
    renderProfile()
    const trigger = screen.getByRole('button', { name: 'Profile' })
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('link', { name: 'Profile' }))
    expect(screen.getByLabelText('Current route').textContent).toBe('/profile')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('link', { name: 'Other route' }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('uses independent disclosure IDs for multiple instances', () => {
    renderProfile({ repeat: true })
    const triggers = screen.getAllByRole('button', { name: 'Profile' })
    expect(triggers[0].getAttribute('aria-controls')).not.toBe(
      triggers[1].getAttribute('aria-controls')
    )
  })

  it('retains the existing desktop avatar and omits dock-only content at 768px', () => {
    window.innerWidth = 768
    const { container } = renderProfile({ settings: { company_name: 'Community Cooperative' } })
    const trigger = container.querySelector('.profile > .img')
    expect(trigger.tagName).toBe('DIV')
    expect(trigger.querySelector('.MuiAvatar-root')).toBeTruthy()
    expect(container.querySelector('.profile--dock')).toBe(null)
    fireEvent.click(trigger)
    expect(screen.getByRole('link', { name: 'Profile' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Change Password' }).getAttribute('href')).toBe(
      '/change-password'
    )
    expect(screen.queryByRole('combobox', { name: 'Template' })).toBe(null)
    expect(screen.queryByText('Community Cooperative')).toBe(null)
  })
})
