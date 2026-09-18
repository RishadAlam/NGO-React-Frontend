import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import { authDataState, useIsAuthorizedValue, useSetIsAuthorizedState } from '../atoms/authAtoms'
import MainLayout from '../components/layouts/MainLayout'
import { useEffect } from 'react'

const auth = vi.hoisted(() => ({
  permissions: ['client_registration', 'analytics_dashboard_view'],
  role: ['Staff']
}))
vi.mock('recoil-nexus', () => ({ getRecoil: () => auth }))
vi.mock('../components/topBar/TopBar', () => ({ default: () => null }))
vi.mock('../components/sidebarLogo/SideBarLogo', () => ({ default: () => null }))
vi.mock('../components/mobile/MobileBottomNav', () => ({ default: () => null }))
function Authorize({ children }) {
  const set = useSetIsAuthorizedState()
  const authorized = useIsAuthorizedValue()
  useEffect(() => set(true), [set])
  return authorized ? children : null
}
function mount() {
  window.innerWidth = 390
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, auth)}>
      <Authorize>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/services']}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/services" element={null} />
                <Route path="/analytics" element={<h2>Analytics content</h2>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      </Authorize>
    </RecoilRoot>
  )
}
describe('Actual mobile layout navigation', () => {
  it('keeps the same Services element across repeated menu and header-back navigation', async () => {
    const { container } = mount()
    await screen.findByRole('heading', { name: 'mobile.quick_actions' })
    const services = container.querySelector('.mobile-services-page')
    for (let n = 0; n < 3; n++) {
      fireEvent.click(services.querySelector('a[href="/analytics"]'))
      expect(screen.getByText('Analytics content')).toBeTruthy()
      fireEvent.click(screen.getByRole('button', { name: 'mobile.back' }))
      await waitFor(() => expect(screen.queryByText('Analytics content')).toBeNull())
      expect(container.querySelector('.mobile-services-page')).toBe(services)
    }
  })
  it('opens the all-services drawer as a dialog and closes it with Escape', async () => {
    const { container } = mount()
    await screen.findByRole('heading', { name: 'mobile.quick_actions' })
    fireEvent.click(container.querySelector('.mobile-services-page a[href="/analytics"]'))
    fireEvent.click(screen.getByRole('button', { name: 'mobile.open_menu' }))
    expect(screen.getByRole('dialog', { name: 'mobile.all_services' })).toBeTruthy()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})
