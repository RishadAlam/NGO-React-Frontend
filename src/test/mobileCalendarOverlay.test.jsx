import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DatePickerInputField from '../components/utilities/DatePickerInputField'

function finePointerViewport(width) {
  window.innerWidth = width
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    media: query,
    matches:
      query.includes('pointer: fine') && (!query.includes('min-width: 768px') || width >= 768),
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {}
  }))
}

describe('calendar overlay viewport boundary', () => {
  it('uses a bounded modal on a narrow screen even with a fine pointer', async () => {
    finePointerViewport(320)
    render(<DatePickerInputField label="Date" defaultValue="2026-09-18" setChange={() => {}} />)
    const field = screen.getByRole('textbox')
    fireEvent.click(field)
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(document.querySelector('.MuiDialog-paper')).toBeTruthy()
    expect(document.querySelector('.MuiPickersPopper-paper')).toBeNull()
  })

  it('keeps the existing desktop popover at the 768px boundary with a fine pointer', async () => {
    finePointerViewport(768)
    render(<DatePickerInputField label="Date" defaultValue="2026-09-18" setChange={() => {}} />)
    fireEvent.click(screen.getByRole('button'))
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(document.querySelector('.MuiPickersPopper-paper')).toBeTruthy()
    expect(document.querySelector('.MuiDialog-paper')).toBeNull()
  })
})
