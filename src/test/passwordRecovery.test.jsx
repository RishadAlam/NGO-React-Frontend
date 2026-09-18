import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import AccountVerification from '../pages/accountVerification/AccountVerification'
import ForgotPassword from '../pages/forgotPassword/ForgotPassword'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))

beforeEach(() => {
  window.innerWidth = 1440
  xFetch.mockReset()
})

function mountVerification(purpose = 'recovery') {
  return render(
    <RecoilRoot>
      <MemoryRouter
        initialEntries={[{ pathname: '/account-verification', state: { id: 7, purpose } }]}>
        <Routes>
          <Route path="/account-verification" element={<AccountVerification />} />
          <Route path="/login" element={<p>Back to sign in</p>} />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  )
}

function submitCode(container) {
  const input = container.querySelector('.otp-boxes input')
  fireEvent.paste(input, { clipboardData: { getData: () => '123456' } })
  fireEvent.submit(container.querySelector('form'))
}

it.each([390, 1440])(
  'carries account, purpose and one-time reset proof through recovery at %spx',
  async (width) => {
    window.innerWidth = width
    const proof = 'a'.repeat(64)
    xFetch
      .mockResolvedValueOnce({ success: true, reset_token: proof })
      .mockResolvedValueOnce({ success: false, errors: { message: 'Try again' } })
    const { container } = mountVerification()
    submitCode(container)
    const password = await screen.findByLabelText('auth.new_password')
    expect(xFetch.mock.calls[0][1]).toEqual({ otp: '123456', user_id: 7, purpose: 'recovery' })
    expect(xFetch.mock.calls[0][3]).toBeNull()
    fireEvent.change(password, { target: { value: 'NewPassword8!' } })
    fireEvent.change(screen.getByLabelText('auth.confirm_password'), {
      target: { value: 'NewPassword8!' }
    })
    fireEvent.submit(container.querySelector('form'))
    await waitFor(() => expect(xFetch).toHaveBeenCalledTimes(2))
    expect(xFetch.mock.calls[1][1]).toEqual({
      user_id: 7,
      reset_token: proof,
      new_password: 'NewPassword8!',
      confirm_password: 'NewPassword8!'
    })
  }
)

it('does not open password reset when recovery proof is missing', async () => {
  xFetch.mockResolvedValue({ success: true })
  const { container } = mountVerification()
  submitCode(container)
  await screen.findByText('localization.shared.unexpected_error')
  expect(screen.queryByLabelText('auth.new_password')).toBeNull()
})

it('restores desktop password reset after a network failure', async () => {
  xFetch
    .mockResolvedValueOnce({ success: true, reset_token: 'a'.repeat(64) })
    .mockRejectedValueOnce({ message: 'Connection lost' })
  const { container } = mountVerification()
  submitCode(container)
  fireEvent.change(await screen.findByLabelText('auth.new_password'), {
    target: { value: 'NewPassword8!' }
  })
  fireEvent.change(screen.getByLabelText('auth.confirm_password'), {
    target: { value: 'NewPassword8!' }
  })
  fireEvent.submit(container.querySelector('form'))
  await screen.findByText('Connection lost')
  expect(screen.getByRole('button', { name: 'Reset password' }).disabled).toBe(false)
})

it('returns email verification to login without offering an unauthorized reset', async () => {
  xFetch.mockResolvedValue({ success: true })
  const { container } = mountVerification('verification')
  submitCode(container)
  await screen.findByText('Back to sign in')
  expect(screen.queryByLabelText('auth.new_password')).toBeNull()
})

it('restores desktop OTP controls after a failed request so verification can be retried', async () => {
  xFetch.mockRejectedValue({ message: 'Connection lost' })
  const { container } = mountVerification()
  submitCode(container)
  await screen.findByText('Connection lost')
  expect(screen.getByRole('button', { name: 'Verify' }).disabled).toBe(false)
})

it('starts recovery without putting an AbortSignal in the authorization header', async () => {
  xFetch.mockRejectedValue({ message: 'Connection lost' })
  const { container } = render(
    <RecoilRoot>
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    </RecoilRoot>
  )
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'support@example.test' } })
  fireEvent.submit(container.querySelector('form'))
  await screen.findByText('Connection lost')
  expect(xFetch.mock.calls[0][3]).toBeNull()
  expect(screen.getByRole('button', { name: 'Send Reset OTP' }).disabled).toBe(false)
})
