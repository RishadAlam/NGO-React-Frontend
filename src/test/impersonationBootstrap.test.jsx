import axios from 'axios'
import { render, screen, waitFor } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { afterEach, expect, it, vi } from 'vitest'
import AuthProvider from '../components/_helper/AuthProvider'
import { saveImpersonationSession } from '../helper/impersonationSession'

vi.mock('axios', () => ({
  default: Object.assign(vi.fn(), { all: (items) => Promise.all(items) })
}))
vi.mock('recoil-nexus', () => ({ getRecoil: () => ({}) }))
vi.mock('react-i18next', () => ({
  initReactI18next: {},
  useTranslation: () => ({ t: (key) => key })
}))
vi.mock('i18next', () => ({
  default: {
    use() {
      return this
    },
    init() {},
    isInitialized: true,
    t: (key) => key
  }
}))

afterEach(() => window.sessionStorage.clear())

it('keeps return and countdown available after a refreshed temporary session fails to load', async () => {
  vi.stubEnv('VITE_BASE_URI', 'https://test.invalid')
  saveImpersonationSession({
    name: 'Test staff',
    access_token: 'temporary',
    impersonation: { remaining_seconds: 900 }
  })
  window.sessionStorage.setItem('accessToken', JSON.stringify('original-admin'))
  axios.mockRejectedValue({ request: {} })
  render(
    <RecoilRoot>
      <MemoryRouter>
        <ErrorBoundary fallback={<p>Unexpected failure</p>}>
          <AuthProvider>
            <p>Private application content</p>
          </AuthProvider>
        </ErrorBoundary>
      </MemoryRouter>
    </RecoilRoot>
  )
  await waitFor(() => expect(screen.getByText('impersonation.load_failed')).toBeTruthy())
  expect(screen.getByRole('button', { name: 'impersonation.return' })).toBeTruthy()
  expect(screen.getByRole('timer')).toBeTruthy()
  expect(screen.queryByText('Private application content')).toBeNull()
  expect(JSON.parse(window.sessionStorage.getItem('accessToken'))).toBe('original-admin')
})

it('handles an already expired session before bootstrapping the original account', async () => {
  vi.stubEnv('VITE_BASE_URI', 'https://test.invalid')
  window.sessionStorage.setItem(
    'ngo.impersonation',
    JSON.stringify({
      accessToken: 'expired',
      name: 'Test staff',
      expiresAt: Date.now() - 1000
    })
  )
  window.sessionStorage.setItem('accessToken', JSON.stringify('original-admin'))
  axios.mockReset()
  axios.mockResolvedValue({
    data: { success: true, id: 1, name: 'Admin', permissions: [], role: [], data: [] }
  })
  render(
    <RecoilRoot>
      <MemoryRouter>
        <ErrorBoundary fallback={<p>Unexpected failure</p>}>
          <AuthProvider>
            <p>Private application content</p>
          </AuthProvider>
        </ErrorBoundary>
      </MemoryRouter>
    </RecoilRoot>
  )
  await waitFor(() => expect(window.sessionStorage.getItem('ngo.impersonation')).toBeNull())
  await new Promise((resolve) => setTimeout(resolve, 10))
  expect(screen.queryByText('Private application content')).toBeNull()
  expect(screen.queryByRole('complementary', { name: 'impersonation.session' })).toBeNull()
  expect(JSON.parse(window.sessionStorage.getItem('accessToken'))).toBe('original-admin')
})
