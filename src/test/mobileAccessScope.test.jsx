import { useEffect, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { describe, expect, it, vi } from 'vitest'
import { useSWRConfig } from 'swr'
import { authDataState, useSetIsAuthorizedState } from '../atoms/authAtoms'
import MobileAccessScope from '../components/mobile/MobileAccessScope'

let setAuth
function Control() {
  setAuth = useSetRecoilState(authDataState)
  const authorize = useSetIsAuthorizedState()
  useEffect(() => authorize(true), [authorize])
  return null
}
function Probe({ mounted }) {
  const [open, setOpen] = useState(false)
  const { cache } = useSWRConfig()
  useEffect(() => {
    mounted(cache)
  }, [mounted, cache])
  return (
    <>
      <button onClick={() => setOpen(true)}>Open privileged form</button>
      {open && <div role="dialog">Form</div>}
    </>
  )
}
function mount(width) {
  window.innerWidth = width
  const mounted = vi.fn()
  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(authDataState, {
          id: 1,
          accessToken: 'test-session',
          permissions: ['view', 'edit']
        })
      }>
      <Control />
      <MobileAccessScope>
        <Probe mounted={mounted} />
      </MobileAccessScope>
    </RecoilRoot>
  )
  return mounted
}
describe('Mobile-only access lifecycle', () => {
  it('discards privileged forms and cache on permission revocation, not ordinary auth updates', () => {
    const mounted = mount(390)
    const cache = mounted.mock.calls.at(-1)[0]
    cache.set('restricted-data', { data: 'old role data' })
    fireEvent.click(screen.getByText('Open privileged form'))
    const mountCount = mounted.mock.calls.length
    act(() =>
      setAuth({
        id: 1,
        accessToken: 'test-session',
        name: 'Updated',
        permissions: ['edit', 'view']
      })
    )
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(mounted).toHaveBeenCalledTimes(mountCount)
    act(() => setAuth({ id: 1, accessToken: 'test-session', permissions: ['view'] }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(mounted.mock.calls.at(-1)[0].get('restricted-data')).toBeUndefined()
  })
  it('fails closed for missing mobile permission data', () => {
    mount(390)
    act(() => setAuth({ id: 1, accessToken: 'test-session' }))
    expect(screen.queryByText('Open privileged form')).toBeNull()
    expect(screen.getByRole('status')).toBeTruthy()
  })
  it.each([768, 1024, 1440])(
    'does not replace the existing desktop/tablet lifecycle at %i px',
    (width) => {
      const mounted = mount(width)
      const mountCount = mounted.mock.calls.length
      fireEvent.click(screen.getByText('Open privileged form'))
      act(() => setAuth({ id: 1, permissions: [] }))
      expect(screen.getByRole('dialog')).toBeTruthy()
      expect(mounted).toHaveBeenCalledTimes(mountCount)
    }
  )
})
