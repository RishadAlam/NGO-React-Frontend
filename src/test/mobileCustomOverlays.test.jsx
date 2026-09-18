import { fireEvent, screen, waitFor } from '@testing-library/react'
import i18n from 'i18next'
import Swal from 'sweetalert2'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import successAlert from '../helper/successAlert'
import { passwordCheckAlert } from '../helper/deleteAlert'
import xFetch from '../utilities/xFetch'

// Keep the actual confirmation and validation UI; replace only the remote request.
vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))

beforeEach(async () => {
  window.innerWidth = 390
  // JSDOM has no layout. SweetAlert checks this to keep validation failures open.
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    return this.style.display === 'none' ? 0 : 100
  })
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, bn: { translation: bn } }
  })
})

afterEach(() => {
  Swal.close()
})

describe('mobile alert recovery', () => {
  it.each([
    ['en', 'Close'],
    ['bn', 'বন্ধ করুন']
  ])('keeps an error available until acknowledged in %s', async (language, closeLabel) => {
    await i18n.changeLanguage(language)
    const result = successAlert('Unable to save', 'Please try again.', 'error')

    expect(Swal.getTimerLeft()).toBeUndefined()
    fireEvent.click(screen.getByRole('button', { name: closeLabel }))
    expect((await result).isConfirmed).toBe(true)
  })

  it('preserves timed success notifications on mobile', () => {
    successAlert('Saved', 'The record was saved.', 'success')
    expect(Swal.getTimerLeft()).toBeGreaterThan(0)
    expect(Swal.getConfirmButton().style.display).toBe('none')
  })

  it('preserves existing tablet error behavior at 768px', () => {
    window.innerWidth = 768
    successAlert('Unable to save', 'Please try again.', 'error')
    expect(Swal.getTimerLeft()).toBeGreaterThan(0)
    expect(Swal.getConfirmButton().style.display).toBe('none')
  })

  it('shows a parsed server validation message without dismissing password confirmation', async () => {
    xFetch.mockResolvedValueOnce({ success: false, message: 'The password is incorrect.' })
    passwordCheckAlert(i18n.t.bind(i18n), 'test-token')
    fireEvent.change(Swal.getInput(), { target: { value: 'incorrect-password' } })
    fireEvent.click(Swal.getConfirmButton())

    await waitFor(() =>
      expect(Swal.getValidationMessage().textContent).toBe('The password is incorrect.')
    )
    expect(Swal.isVisible()).toBe(true)
    expect(xFetch).toHaveBeenCalledWith(
      'verify-user',
      { password: 'incorrect-password' },
      null,
      'test-token',
      null,
      'POST'
    )
  })

  it('retains password confirmation success semantics', async () => {
    xFetch.mockResolvedValueOnce({ success: true })
    const result = passwordCheckAlert(i18n.t.bind(i18n), 'test-token')
    fireEvent.change(Swal.getInput(), { target: { value: 'valid-password' } })
    fireEvent.click(Swal.getConfirmButton())
    expect(await result).toMatchObject({ isConfirmed: true, value: true })
  })
})
