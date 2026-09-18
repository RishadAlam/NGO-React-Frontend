import axios from 'axios'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cookies from 'js-cookie'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Staffs from '../pages/staffs/Staffs'
import xFetch from '../utilities/xFetch'
import ImpersonationBanner from '../components/staff/ImpersonationBanner'
import {
  getImpersonationSession,
  saveImpersonationSession,
  sessionNavigationEvent
} from '../helper/impersonationSession'

const session = vi.hoisted(() => ({ auth: {}, staff: {} }))
vi.mock('axios', () => ({ default: vi.fn() }))
vi.mock('recoil-nexus', () => ({ getRecoil: () => session.auth }))
vi.mock('../hooks/useFetch', () => ({
  default: () => ({ data: { data: [session.staff] }, mutate: vi.fn(), isLoading: false })
}))

const request = (endpoint, method = 'GET', data = null, token = 'Bearer temporary') =>
  xFetch(endpoint, data, null, token, null, method)

beforeEach(() => {
  window.innerWidth = 1440
  window.sessionStorage.clear()
  vi.stubEnv('VITE_BASE_URI', 'https://test.invalid')
  session.auth = {
    id: 1,
    accessToken: 'Bearer temporary',
    permissions: [],
    impersonation: { read_only: true }
  }
  session.staff = {
    id: 7,
    name: 'Test staff',
    email: 'staff@example.test',
    phone: '',
    role_id: 3,
    role_name: 'Collector',
    status: 1,
    verified_at: '2026-01-01',
    permissions: [],
    action_history: []
  }
  axios.mockReset()
  axios.mockResolvedValue({ data: { success: true } })
})

afterEach(() => {
  vi.useRealTimers()
  window.sessionStorage.clear()
  Cookies.remove('accessToken')
})

describe('View-only sessions at the HTTP boundary', () => {
  it.each([
    ['PUT', 'profile-update'],
    ['POST', 'profile-update'],
    ['PUT', 'change-password'],
    ['POST', 'users/8/impersonation'],
    ['DELETE', 'users/8'],
    ['POST', 'login'],
    ['GET', 'transactions/approve-transactions/8/saving_to_saving'],
    ['GET', 'cache-clear'],
    ['GET', 'otp-resend/8']
  ])('blocks %s %s even on desktop', async (method, endpoint) => {
    await expect(request(endpoint, method)).rejects.toMatchObject({
      status: 403,
      code: 'IMPERSONATION_READ_ONLY'
    })
    expect(axios).not.toHaveBeenCalled()
  })

  it('blocks multipart method overrides', async () => {
    const data = new FormData()
    data.append('_method', 'PUT')
    await expect(request('profile-update', 'POST', data)).rejects.toMatchObject({ status: 403 })
    expect(axios).not.toHaveBeenCalled()
  })

  it.each([
    ['GET', 'authorization'],
    ['GET', 'fields'],
    ['POST', 'categories-config/element/8'],
    ['POST', 'impersonation/stop']
  ])('permits %s %s', async (method, endpoint) => {
    await expect(request(endpoint, method)).resolves.toEqual({ success: true })
    expect(axios).toHaveBeenCalledTimes(1)
  })

  it('rejects a stale admin request while visiting another user', async () => {
    await expect(request('fields', 'GET', null, 'Bearer original-admin')).rejects.toMatchObject({
      status: 403
    })
    expect(axios).not.toHaveBeenCalled()
  })
})

let setAuth
function AuthControl() {
  setAuth = useSetRecoilState(authDataState)
  return null
}

function mount(permissions, width = 1440, impersonation = null) {
  session.auth = { id: 1, accessToken: 'Bearer admin', permissions, impersonation }
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, session.auth)
        set(windowInnerWidthState, width)
      }}>
      <AuthControl />
      <MemoryRouter>
        <Staffs />
      </MemoryRouter>
    </RecoilRoot>
  )
}

describe('Staff visit action', () => {
  it.each([390, 1440])('shows the action with the exact permission at %i px', (width) => {
    mount(['staff_impersonate'], width)
    expect(screen.getByRole('button', { name: 'impersonation.visit' })).toBeTruthy()
  })

  it.each([[[]], [['staff_list_view']], [['staff_data_update']]])(
    'hides the action without permission %j',
    (permissions) => {
      mount(permissions)
      expect(screen.queryByRole('button', { name: 'impersonation.visit' })).toBeNull()
    }
  )

  it('updates a memoized action when permission is revoked', () => {
    mount(['staff_impersonate'])
    expect(screen.getByRole('button', { name: 'impersonation.visit' })).toBeTruthy()
    act(() => setAuth({ ...session.auth, permissions: [] }))
    expect(screen.queryByRole('button', { name: 'impersonation.visit' })).toBeNull()
  })

  it.each(['self', 'inactive', 'unverified', 'nested'])('prevents a %s visit', (kind) => {
    if (kind === 'self') session.staff.id = 1
    if (kind === 'inactive') session.staff.status = 0
    if (kind === 'unverified') session.staff.verified_at = null
    mount(['staff_impersonate'], 1440, kind === 'nested' ? { read_only: true } : null)
    expect(screen.queryByRole('button', { name: 'impersonation.visit' })).toBeNull()
  })

  it('keeps the admin session when starting the visit fails', async () => {
    axios.mockRejectedValue({ response: { status: 403, data: { message: 'Access denied.' } } })
    mount(['staff_impersonate'])
    fireEvent.click(screen.getByRole('button', { name: 'impersonation.visit' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'impersonation.visit' }).disabled).toBe(false)
    )
    expect(window.sessionStorage.getItem('ngo.impersonation')).toBeNull()
  })

  it('starts once and preserves the original login while switching to the target profile', async () => {
    const navigation = vi.fn()
    window.addEventListener(sessionNavigationEvent, navigation, { once: true })
    window.sessionStorage.setItem('accessToken', JSON.stringify('original-admin'))
    Cookies.set('accessToken', 'remembered-admin')
    let resolve
    axios.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    mount(['staff_impersonate'])
    const visit = screen.getByRole('button', { name: 'impersonation.visit' })
    fireEvent.click(visit)
    fireEvent.click(visit)
    expect(axios).toHaveBeenCalledTimes(1)
    await act(async () =>
      resolve({
        data: {
          success: true,
          access_token: 'temporary',
          impersonation: { remaining_seconds: 900 }
        }
      })
    )
    expect(getImpersonationSession().accessToken).toBe('temporary')
    expect(JSON.parse(window.sessionStorage.getItem('accessToken'))).toBe('original-admin')
    expect(Cookies.get('accessToken')).toBe('remembered-admin')
    expect(navigation.mock.calls[0][0].detail).toBe('/profile')
  })
})

function mountBanner(seconds = 900) {
  session.auth = {
    id: 7,
    name: 'Test staff',
    accessToken: 'Bearer temporary',
    permissions: [],
    impersonation: { read_only: true, remaining_seconds: seconds }
  }
  saveImpersonationSession({
    access_token: 'temporary',
    impersonation: { remaining_seconds: seconds }
  })
  window.sessionStorage.setItem('accessToken', JSON.stringify('original-admin'))
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, session.auth)}>
      <ImpersonationBanner />
    </RecoilRoot>
  )
}

describe('Temporary session lifetime and recovery', () => {
  it('automatically returns at expiry without erasing the original login', () => {
    vi.useFakeTimers()
    mountBanner(2)
    const navigation = vi.fn()
    window.addEventListener(sessionNavigationEvent, navigation, { once: true })
    expect(screen.getByRole('timer').textContent).toBe('00:02')
    act(() => vi.advanceTimersByTime(2000))
    expect(getImpersonationSession()).toBeNull()
    expect(JSON.parse(window.sessionStorage.getItem('accessToken'))).toBe('original-admin')
    expect(navigation.mock.calls[0][0].detail).toBe('/staffs')
  })

  it('returns at expiry even when an earlier stop request is hanging', () => {
    vi.useFakeTimers()
    axios.mockImplementation(() => new Promise(() => {}))
    mountBanner(2)
    const navigation = vi.fn()
    window.addEventListener(sessionNavigationEvent, navigation, { once: true })
    fireEvent.click(screen.getByRole('button', { name: 'impersonation.return' }))
    act(() => vi.advanceTimersByTime(2000))
    expect(getImpersonationSession()).toBeNull()
    expect(navigation).toHaveBeenCalledTimes(1)
  })

  it('stops the server session before returning early', async () => {
    mountBanner()
    const navigation = vi.fn()
    window.addEventListener(sessionNavigationEvent, navigation, { once: true })
    fireEvent.click(screen.getByRole('button', { name: 'impersonation.return' }))
    await waitFor(() => expect(getImpersonationSession()).toBeNull())
    expect(axios.mock.calls[0][0].url.pathname).toBe('/api/impersonation/stop')
    expect(axios.mock.calls[0][0].headers.Authorization).toBe('Bearer temporary')
    expect(navigation).toHaveBeenCalledTimes(1)
  })

  it('retains a retryable return action after a network failure', async () => {
    mountBanner()
    axios.mockRejectedValue({ request: {} })
    fireEvent.click(screen.getByRole('button', { name: 'impersonation.return' }))
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toBe('impersonation.return_failed')
    )
    expect(screen.getByRole('button', { name: 'impersonation.return' }).disabled).toBe(false)
    expect(getImpersonationSession().accessToken).toBe('temporary')
  })

  it('recovers from a revoked token without deleting the original login', async () => {
    saveImpersonationSession({
      access_token: 'temporary',
      impersonation: { remaining_seconds: 900 }
    })
    window.sessionStorage.setItem('accessToken', JSON.stringify('original-admin'))
    Cookies.set('accessToken', 'remembered-admin')
    const navigation = vi.fn()
    window.addEventListener(sessionNavigationEvent, navigation, { once: true })
    axios.mockRejectedValue({ response: { status: 401, data: { message: 'Unauthenticated.' } } })
    await expect(request('authorization')).rejects.toMatchObject({ code: 'IMPERSONATION_ENDED' })
    expect(getImpersonationSession()).toBeNull()
    expect(JSON.parse(window.sessionStorage.getItem('accessToken'))).toBe('original-admin')
    expect(Cookies.get('accessToken')).toBe('remembered-admin')
    expect(navigation).toHaveBeenCalledTimes(1)
  })

  it('does not extend a stored deadline when the banner mounts again', () => {
    vi.useFakeTimers()
    const view = mountBanner(10)
    act(() => vi.advanceTimersByTime(6000))
    view.unmount()
    render(
      <RecoilRoot initializeState={({ set }) => set(authDataState, session.auth)}>
        <ImpersonationBanner />
      </RecoilRoot>
    )
    expect(screen.getByRole('timer').textContent).toBe('00:04')
  })
})
