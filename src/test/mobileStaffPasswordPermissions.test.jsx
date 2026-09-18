import { fireEvent, render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig, unstable_serialize } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import StaffUpdate from '../components/staff/StaffUpdate'
import StaffRegistration from '../components/staff/StaffRegistration'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))

const t = (key) => key
const staff = {
  id: 2,
  name: 'Staff member',
  email: 'staff@example.test',
  role: 1,
  phone: '',
  password: 'StalePassword1!',
  confirm_password: 'StalePassword1!'
}
const rolesResponse = { success: true, data: [{ id: 1, name: 'Officer', is_default: 0 }] }

function mountStaff(permissions, registration = false) {
  const Component = registration ? StaffRegistration : StaffUpdate
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { id: 1, permissions })}>
      <SWRConfig
        value={{
          provider: () => new Map(),
          dedupingInterval: 0,
          fallback: { [unstable_serialize(['roles', null])]: rolesResponse }
        }}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Component
            isOpen
            setIsOpen={() => {}}
            t={t}
            accessToken="test-token"
            data={staff}
            mutate={() => {}}
          />
        </MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

beforeEach(() => {
  window.innerWidth = 390
  xFetch.mockReset()
  xFetch.mockImplementation((action) =>
    Promise.resolve(
      action === 'roles' ? rolesResponse : { success: true, data: [], message: 'Saved' }
    )
  )
})

describe('Mobile staff password permissions', () => {
  it('hides password editing when staff data update is granted without password reset', () => {
    mountStaff(['staff_data_update'])
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(0)
  })

  it('strips existing password values from a denied mobile update request', async () => {
    mountStaff(['staff_data_update'])
    fireEvent.submit(document.querySelector('form'))
    await waitFor(() => {
      const update = xFetch.mock.calls.find(
        ([url, , , , , method]) => url === 'users/2' && method === 'PUT'
      )
      expect(update).toBeTruthy()
      expect(update[1]).toEqual({
        id: 2,
        name: 'Staff member',
        email: 'staff@example.test',
        role: 1,
        phone: ''
      })
    })
  })

  it('preserves password editing and submission with the exact reset grant', async () => {
    mountStaff(['staff_data_update', 'staff_reset_password'])
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(2)
    fireEvent.submit(document.querySelector('form'))
    await waitFor(() =>
      expect(xFetch).toHaveBeenCalledWith('users/2', staff, null, 'test-token', null, 'PUT')
    )
  })

  it('preserves initial credentials for staff registration without a reset grant', () => {
    mountStaff(['staff_registration'], true)
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(2)
  })

  it.each([768, 1024])('preserves desktop password editing at %i px', (width) => {
    window.innerWidth = width
    mountStaff(['staff_data_update'])
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(2)
  })
})
