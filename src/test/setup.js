import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

const translate = (key, fallback) => (typeof fallback === 'string' ? fallback : key)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: translate, i18n: { language: 'en' } })
}))

window.matchMedia = (query) => ({
  matches: query.includes('max-width') ? window.innerWidth < 768 : false,
  media: query,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return true
  }
})
window.scrollTo = vi.fn()
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  document.body.style.overflow = ''
  vi.restoreAllMocks()
})
