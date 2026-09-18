import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'
import { beforeEach, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import ClientRegistration from '../pages/registration/ClientRegistration'
import StaffProfile from '../pages/staffProfile/StaffProfile'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))

let rejectRequest
let resolveRequest
beforeEach(() => {
  window.innerWidth = 390
  document.documentElement.lang = 'en'
  URL.createObjectURL = vi.fn(() => 'blob:test-image')
  xFetch.mockReset()
  xFetch.mockImplementation((action, _data, _unused, _token, _query, method) => {
    if (method === 'POST')
      return new Promise((resolve, reject) => {
        resolveRequest = resolve
        rejectRequest = reject
      })
    return Promise.resolve({
      success: true,
      data:
        action === 'fields/active'
          ? [{ id: 1, name: 'North' }]
          : action === 'centers/active'
            ? [{ id: 2, field_id: 1, name: 'Center One' }]
            : []
    })
  })
})

function mount(element) {
  return render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(authDataState, {
          id: 1,
          name: 'Member',
          phone: '01700000000',
          accessToken: 'test-session'
        })
      }>
      <SWRConfig value={{ provider: () => new Map(), shouldRetryOnError: false }}>
        <MemoryRouter>{element}</MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

async function fillClient() {
  for (const [label, option] of [
    ['field', 'North'],
    ['center', 'Center One']
  ]) {
    const input = screen.getByRole('combobox', { name: new RegExp(`common.${label}`) })
    fireEvent.change(input, { target: { value: option } })
    fireEvent.click(await screen.findByRole('option', { name: option }))
  }
  for (const [name, value] of [
    ['acc_no', '123'],
    ['name', 'Applicant'],
    ['father_name', 'Father'],
    ['mother_name', 'Mother'],
    ['nid', '1234567890'],
    ['primary_phone', '01700000000'],
    ['share', '100']
  ]) {
    fireEvent.change(screen.getByRole('textbox', { name: new RegExp(`^common.${name}`) }), {
      target: { value }
    })
  }
  fireEvent.change(screen.getByRole('combobox', { name: /common.occupation/ }), {
    target: { value: 'Teacher' }
  })
  fireEvent.click(screen.getByRole('radio', { name: 'common.islam' }))
  fireEvent.click(screen.getByRole('radio', { name: 'common.female' }))
  for (const name of [
    'street_address',
    'city',
    'post_office',
    'police_station',
    'district',
    'division'
  ]) {
    for (const input of screen.getAllByLabelText(new RegExp(`^common.${name}`))) {
      fireEvent.change(input, { target: { value: 'Dhaka' } })
    }
  }
  fireEvent.change(
    screen.getByLabelText('localization.shared.upload_image', { selector: 'input' }),
    { target: { files: [new File(['photo'], 'photo.png', { type: 'image/png' })] } }
  )
}

const posts = () => xFetch.mock.calls.filter((call) => call[5] === 'POST')

it.each([
  ['profile-update', StaffProfile, 'common.update'],
  ['client/registration', ClientRegistration, 'common.registration']
])(
  'blocks duplicate phone submissions and restores retry after rejection (%s)',
  async (endpoint, Component, buttonName) => {
    const { container } = mount(<Component />)
    if (Component === ClientRegistration) await fillClient()
    const form = container.querySelector('form')
    const button = screen.getByRole('button', { name: buttonName })
    act(() => {
      fireEvent.submit(form)
      fireEvent.submit(form)
    })
    expect(posts()).toHaveLength(1)
    expect(posts()[0][0]).toBe(endpoint)
    expect(posts()[0][6]).toBe(true)
    expect(button.disabled).toBe(true)
    expect(screen.getByRole('textbox', { name: /^common.name/ }).disabled).toBe(true)
    const submitted = Object.fromEntries(posts()[0][1])
    if (Component === StaffProfile)
      expect(submitted).toEqual({ _method: 'PUT', name: 'Member', phone: '01700000000', image: '' })
    else {
      expect(submitted.acc_no).toBe('123')
      expect(submitted.field_id).toBe('1')
      expect(submitted.center_id).toBe('2')
      expect(submitted['present_address[city]']).toBe('Dhaka')
      expect(submitted.field).toBeUndefined()
    }
    await act(async () => rejectRequest(new Error('Offline')))
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Offline')
    await waitFor(() => expect(button.disabled).toBe(false))
    expect(screen.getByRole('textbox', { name: /^common.name/ }).disabled).toBe(false)
    expect(screen.getByRole('textbox', { name: /^common.name/ }).value).toBe(
      Component === StaffProfile ? 'Member' : 'Applicant'
    )
    fireEvent.submit(form)
    expect(posts()).toHaveLength(2)
    await act(async () => resolveRequest({ success: false, message: 'Try again' }))
    expect(button.disabled).toBe(false)
  }
)

it.each([
  ['profile-update', StaffProfile],
  ['client/registration', ClientRegistration]
])(
  'shows a translated fallback for a rejection without a message (%s)',
  async (_endpoint, Component) => {
    const { container } = mount(<Component />)
    if (Component === ClientRegistration) await fillClient()
    fireEvent.submit(container.querySelector('form'))
    await act(async () => rejectRequest({}))
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'localization.shared.unexpected_error'
    )
  }
)

it('preserves the desktop profile pending-control behavior at 768px', async () => {
  window.innerWidth = 768
  const { container } = mount(<StaffProfile />)
  fireEvent.submit(container.querySelector('form'))
  expect(screen.getByRole('button', { name: 'common.update' }).disabled).toBe(false)
  expect(screen.getByRole('textbox', { name: /^common.name/ }).disabled).toBe(false)
  await act(async () => resolveRequest({ success: true, name: 'Member', phone: '01700000000' }))
})
