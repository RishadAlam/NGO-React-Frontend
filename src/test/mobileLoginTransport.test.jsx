import axios from 'axios'
import { render, screen, waitFor } from '@testing-library/react'
import { Toaster, toast } from 'react-hot-toast'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import xFetch from '../utilities/xFetch'

vi.mock('axios', () => ({ default: vi.fn() }))
afterEach(() => toast.remove())
beforeEach(() => toast.remove())
it.each([
  [390, 'login', 500, true],
  [768, 'login', 500, false],
  [390, 'login', 422, false],
  [390, 'other', 500, false]
])(
  'only sanitizes mobile login server errors (%i %s %i)',
  async (width, endpoint, status, sanitize) => {
    window.innerWidth = width
    vi.stubEnv('VITE_BASE_URI', 'https://example.test')
    render(<Toaster />)
    axios.mockRejectedValue({ response: { status, data: { message: 'SMTP 550 private details' } } })
    await expect(xFetch(endpoint, {}, null, null, null, 'POST')).rejects.toHaveProperty(
      'status',
      status
    )
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(
        sanitize ? 'Something went wrong. Please try again.' : 'SMTP 550 private details'
      )
    )
  }
)
