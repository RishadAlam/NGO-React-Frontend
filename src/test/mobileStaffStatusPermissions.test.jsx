import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Staffs from '../pages/staffs/Staffs'

const fixture = vi.hoisted(() => ({
  staff: {
    id: 7,
    name: 'Test staff',
    email: 'staff@example.test',
    phone: '',
    role: 'Collector',
    role_id: 3,
    role_is_default: 0,
    status: 1,
    email_verified_at: null,
    image_uri: null,
    permissions: [],
    action_history: [],
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z'
  }
}))

vi.mock('../hooks/useFetch', () => ({
  default: () => ({ data: { data: [fixture.staff] }, mutate: vi.fn(), isLoading: false })
}))

let setAuth
function AuthControl() {
  setAuth = useSetRecoilState(authDataState)
  return null
}

function mount(permissions = [], width = 390) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { id: 1, accessToken: 'test-token', permissions })
        set(windowInnerWidthState, width)
      }}>
      <AuthControl />
      <MemoryRouter>
        <Staffs />
      </MemoryRouter>
    </RecoilRoot>
  )
}

function staffRow() {
  return within(document.querySelector('[role="listitem"]'))
}

beforeEach(() => {
  fixture.staff.status = 1
})

describe('Mobile staff status permissions', () => {
  it.each([
    [1, 'common.active'],
    [0, 'common.inactive']
  ])('shows status %i as text instead of a denied switch', (status, label) => {
    fixture.staff.status = status
    mount(['staff_data_update'])
    expect(staffRow().queryByRole('checkbox', { hidden: true })).toBeNull()
    expect(staffRow().getByText(label)).toBeTruthy()
  })

  it('keeps the switch interactive with the exact status grant', () => {
    mount(['staff_status_update'])
    expect(staffRow().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
  })

  it('replaces a memoized status switch when the grant is revoked', () => {
    mount(['staff_status_update'])
    expect(staffRow().getByRole('checkbox', { hidden: true }).disabled).toBe(false)
    act(() => setAuth({ id: 1, accessToken: 'test-token', permissions: [] }))
    expect(staffRow().queryByRole('checkbox', { hidden: true })).toBeNull()
    expect(staffRow().getByText('common.active')).toBeTruthy()
  })

  it.each([768, 1024])('retains the existing disabled desktop switch at %i px', (width) => {
    mount([], width)
    expect(within(screen.getByRole('table')).getByRole('checkbox', { hidden: true }).disabled).toBe(
      true
    )
  })
})
