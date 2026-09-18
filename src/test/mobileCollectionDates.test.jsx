import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import LoanReportSheet from '../pages/regularCollection/LoanReportSheet'
import SavingReportSheet from '../pages/regularCollection/SavingReportSheet'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
vi.mock('recoil-nexus', () => ({ getRecoil: () => ({ permissions: [] }) }))
const boundary = vi.hoisted(() => ({ dateConfig: null }))
// Preserve the real control, while allowing a stale/null library callback to
// exercise the sheet's defensive boundary independently of MUI's clear policy.
vi.mock('../components/utilities/SelectBoxField', async (importOriginal) => {
  const { default: SelectBoxField } = await importOriginal()
  return {
    default: (props) => {
      if (props.label === 'common.date') boundary.dateConfig = props.config
      return <SelectBoxField {...props} />
    }
  }
})
beforeEach(() => {
  xFetch.mockReset()
  xFetch.mockImplementation((action) =>
    Promise.resolve(
      action === 'users/active'
        ? { data: [] }
        : { data: { dates: ['2026-09-18', '2026-09-17'], collections: [] } }
    )
  )
})

function mount(Page, width) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { id: 1, permissions: [], accessToken: 'test' })
        set(windowInnerWidthState, width)
      }}>
      <SWRConfig
        value={{ provider: () => new Map(), revalidateOnFocus: false, shouldRetryOnError: false }}>
        <MemoryRouter initialEntries={['/report/3/4']}>
          <Routes>
            <Route path="/report/:category_id/:field_id" element={<Page isRegular={false} />} />
          </Routes>
        </MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

describe.each([
  ['loan', LoanReportSheet],
  ['saving', SavingReportSheet]
])('Pending %s dates', (_kind, Page) => {
  it('ignores a null date callback and preserves the last valid date', async () => {
    mount(Page, 390)
    const input = screen.getByRole('combobox', { name: 'common.date' })
    await waitFor(() => expect(input.value).toBe('18/09/2026'))
    expect(() => act(() => boundary.dateConfig.onChange(null, null))).not.toThrow()
    expect(input.value).toBe('18/09/2026')
  })
  it('keeps a required date selected without offering a crashing clear button on phones', async () => {
    mount(Page, 390)
    const input = screen.getByRole('combobox', { name: 'common.date' })
    await waitFor(() => expect(input.value).toBe('18/09/2026'))
    fireEvent.focus(input)
    expect(screen.queryByTitle('localization.shared.clear')).toBeNull()
    fireEvent.mouseDown(input)
    fireEvent.click(await screen.findByRole('option', { name: '17/09/2026' }))
    expect(input.value).toBe('17/09/2026')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    await waitFor(() => expect(input.value).toBe('17/09/2026'))
  })

  it('retains the existing clearable control at the 768px boundary', async () => {
    mount(Page, 768)
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'common.date' }).value).toBe('18/09/2026')
    )
    fireEvent.focus(screen.getByRole('combobox', { name: 'common.date' }))
    expect(screen.getByTitle('localization.shared.clear')).toBeTruthy()
  })
})
