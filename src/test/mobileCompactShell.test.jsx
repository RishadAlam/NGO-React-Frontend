import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import { authDataState, useIsAuthorizedValue, useSetIsAuthorizedState } from '../atoms/authAtoms'
import MainLayout from '../components/layouts/MainLayout'

const auth = vi.hoisted(() => ({
  id: 1,
  name: 'Employee',
  permissions: [],
  accessToken: 'test-session',
  role: ['Staff']
}))
vi.mock('recoil-nexus', () => ({ getRecoil: () => auth }))

function Authorize({ children }) {
  const setAuthorized = useSetIsAuthorizedState()
  const authorized = useIsAuthorizedValue()
  useEffect(() => setAuthorized(true), [setAuthorized])
  return authorized ? children : null
}

function mount(width) {
  window.innerWidth = width
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, auth)}>
      <Authorize>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/static-content']}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/static-content" element={<p>Route content</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      </Authorize>
    </RecoilRoot>
  )
}

describe('Compact phone shell', () => {
  it.each([320, 390, 767])('unmounts the entire top bar below 768px (%ipx)', (width) => {
    const { container } = mount(width)
    expect(screen.getByText('Route content')).toBeTruthy()
    expect(container.querySelector('.top-bar')).toBeNull()
    expect(container.querySelector('.mainSearchBox')).toBeNull()
    expect(container.querySelector('.palette-select')).toBeNull()
    expect(container.querySelector('.mobile-page-header')).not.toBeNull()
  })

  it.each([768, 1024, 1440])('retains the existing top bar and one palette at %ipx', (width) => {
    const { container } = mount(width)
    expect(screen.getByText('Route content')).toBeTruthy()
    expect(container.querySelector('.top-bar')).not.toBeNull()
    expect(container.querySelector('.top-bar .mainSearchBox')).not.toBeNull()
    expect(container.querySelectorAll('.palette-select')).toHaveLength(1)
    expect(container.querySelector('.top-bar .palette-select')).not.toBeNull()
  })
})
