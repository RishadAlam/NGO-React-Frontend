import axios from 'axios'
import i18n from 'i18next'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../public/lang/en/translations.json'
import bn from '../../public/lang/bn/translations.json'
import dateFormat from '../libs/dateFormat'
import tsNumbers from '../libs/tsNumbers'
import xFetch from '../utilities/xFetch'

vi.mock('axios', () => ({ default: vi.fn() }))
vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn() } }))
vi.mock('recoil-nexus', () => ({ getRecoil: () => ({ permissions: [] }) }))

beforeEach(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: false,
    resources: { en: { translation: en }, bn: { translation: bn } }
  })
  window.innerWidth = 390
  vi.stubEnv('VITE_BASE_URI', 'https://test.invalid')
  axios.mockReset()
  toast.error.mockClear()
})

describe('Localized utility output preserves request values', () => {
  it.each([
    ['en', '৳120/-'],
    ['bn', '৳১২০/-']
  ])('keeps Bangladesh taka in %s instead of changing currency with language', (lng, expected) => {
    Cookies.set('i18next', lng)
    expect(tsNumbers('৳120/-')).toBe(expected)
    expect(tsNumbers('$120/-')).toBe(expected)
    expect(tsNumbers('১২০.৫০', true)).toBe('120.50')
    Cookies.remove('i18next')
  })
  it('translates displayed month/day names and periods when the language changes', async () => {
    const date = new Date(2026, 8, 18, 15, 30)
    expect(dateFormat(date, 'EEEE d MMMM yyyy hh:mm a')).toBe('Friday 18 September 2026 03:30 PM')
    await i18n.changeLanguage('bn')
    expect(dateFormat(date, 'EEEE d MMMM yyyy hh:mm a')).toBe(
      'শুক্রবার 18 সেপ্টেম্বর 2026 03:30 অপরাহ্ন'
    )
  })
  it.each(['en', 'bn'])('does not translate ISO dates sent to the API in %s', async (lng) => {
    await i18n.changeLanguage(lng)
    expect(dateFormat(new Date(2026, 8, 18), 'yyyy-MM-dd')).toBe('2026-09-18')
  })
  it.each(['en', 'bn'])(
    'translates client permission denials in %s without dispatch',
    async (lng) => {
      await i18n.changeLanguage(lng)
      await expect(xFetch('fields/12', {}, null, 'token', null, 'PUT')).rejects.toMatchObject({
        status: 403,
        message: i18n.t('common_validation.unauthorized_action')
      })
      expect(axios).not.toHaveBeenCalled()
    }
  )
  it.each(['en', 'bn'])(
    'translates network failures and forwards the requested language in %s',
    async (lng) => {
      await i18n.changeLanguage(lng)
      Cookies.set('i18next', lng)
      const requestError = { offline: true }
      axios.mockRejectedValue({ request: requestError })
      await expect(xFetch('fields')).rejects.toEqual(requestError)
      expect(toast.error).toHaveBeenCalledWith(i18n.t('common_validation.network_error'))
      expect(axios.mock.calls[0][0].headers['Accept-Language']).toBe(lng)
      Cookies.remove('i18next')
    }
  )
  it('preserves server-provided messages and submitted records', async () => {
    await i18n.changeLanguage('bn')
    window.innerWidth = 1024
    const record = { name: 'Member name', status: true }
    const response = { message: 'Server-owned response', errors: { name: ['Server validation'] } }
    axios.mockRejectedValue({ response: { status: 422, data: response } })
    await expect(xFetch('fields/12', record, null, 'token', null, 'PUT')).rejects.toMatchObject(
      response
    )
    expect(toast.error).toHaveBeenCalledWith(response.message)
    expect(JSON.parse(axios.mock.calls[0][0].data)).toEqual(record)
  })
})
