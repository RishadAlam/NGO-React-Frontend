import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig, unstable_serialize } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import useFetch from '../hooks/useFetch'
import LoanReport from '../pages/regularCollection/LoanReport'
import SavingReport from '../pages/regularCollection/SavingReport'
import LoanReportSheet from '../pages/regularCollection/LoanReportSheet'
import SavingReportSheet from '../pages/regularCollection/SavingReportSheet'
import xFetch from '../utilities/xFetch'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
vi.mock('recoil-nexus', () => ({ getRecoil: () => ({ permissions: [] }) }))

const screens = [
  ['loan report', LoanReport, 'loan', false],
  ['saving report', SavingReport, 'saving', false],
  ['loan sheet', LoanReportSheet, 'loan', true],
  ['saving sheet', SavingReportSheet, 'saving', true]
]
const failure = { status: 503, success: false, message: 'Service unavailable' }

beforeEach(() => {
  xFetch.mockReset()
  xFetch.mockImplementation((action) =>
    action === 'users/active' ? Promise.resolve({ data: [] }) : Promise.reject(failure)
  )
})

function mount(element, { width = 390, fallback = {} } = {}) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { id: 1, permissions: [], accessToken: 'session' })
        set(windowInnerWidthState, width)
      }}>
      <SWRConfig
        value={{
          provider: () => new Map(),
          shouldRetryOnError: false,
          revalidateOnFocus: false,
          dedupingInterval: 0,
          fallback
        }}>
        <MemoryRouter initialEntries={['/report/3/4']}>
          <Routes>
            <Route path="/report/:category_id/:field_id" element={element} />
          </Routes>
        </MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

function HookStatus() {
  const { data, hasError, isError, isLoading } = useFetch({ action: 'report' })
  return <output>{JSON.stringify({ hasError, isError, isLoading, data })}</output>
}

describe('Fetch error signal', () => {
  it.each([failure, new Error('Offline')])(
    'reports errors that lack validation-error fields',
    async (error) => {
      xFetch.mockRejectedValue(error)
      mount(<HookStatus />)
      await waitFor(() =>
        expect(JSON.parse(screen.getByRole('status').textContent)).toEqual({
          hasError: true,
          isLoading: false
        })
      )
    }
  )

  it('keeps the existing validation errors while adding the boolean signal', async () => {
    xFetch.mockRejectedValue({ success: false, errors: { date: ['Invalid date'] } })
    mount(<HookStatus />)
    await waitFor(() =>
      expect(JSON.parse(screen.getByRole('status').textContent)).toEqual({
        hasError: true,
        isError: { date: ['Invalid date'] },
        isLoading: false
      })
    )
  })

  it('reports a successful fetch without changing its response data', async () => {
    xFetch.mockResolvedValue({ success: true, data: { total: 120 } })
    mount(<HookStatus />)
    await waitFor(() =>
      expect(JSON.parse(screen.getByRole('status').textContent)).toEqual({
        hasError: false,
        isLoading: false,
        data: { success: true, data: { total: 120 } }
      })
    )
  })
})

describe.each(screens)('Mobile %s recovery', (_name, Page, kind, sheet) => {
  it.each([true, false])(
    'shows retry instead of a false empty result (regular=%s)',
    async (isRegular) => {
      const { container } = mount(<Page isRegular={isRegular} />)
      await screen.findByRole('alert')
      expect(screen.getByText('mobile.collection_load_error')).toBeTruthy()
      expect(container.querySelector('.staff-table')).toBeNull()

      xFetch.mockResolvedValue({ data: { report: [], collections: [], dates: [] } })
      fireEvent.click(screen.getByRole('button', { name: 'mobile.retry' }))
      await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
      expect(container.querySelector('.staff-table')).not.toBeNull()
    }
  )

  it.each([768, 1024])(
    'does not change the existing non-mobile failure display at %ipx',
    async (width) => {
      const { container } = mount(<Page />, { width })
      await waitFor(() =>
        expect(
          container.querySelector(sheet ? '.collection-sheet-card' : '.react-table-card')
        ).not.toBeNull()
      )
      expect(screen.queryByRole('alert')).toBeNull()
      expect(screen.queryByRole('button', { name: 'mobile.retry' })).toBeNull()
    }
  )

  it('keeps a failed retry actionable without an unhandled request rejection', async () => {
    mount(<Page />)
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'mobile.retry' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'mobile.retry' }).disabled).toBe(false)
    )
    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('keeps previously loaded records visible beside the failure notice', async () => {
    const endpoint = `collection/${kind}/regular/collection-sheet/3${sheet ? '/4' : ''}`
    const account = {
      id: 7,
      acc_no: 42,
      payable_deposit: 100,
      installment: 1,
      client_registration: { name: 'Recorded member' },
      saving_collection: [],
      loan_collection: []
    }
    const response = {
      data: {
        category_name: 'Recorded category',
        field_name: 'Recorded field',
        dates: [],
        report: [{ id: 4, name: 'Recorded field', saving_collection: [], loan_collection: [] }],
        collections: [
          { id: 2, name: 'Recorded center', saving_account: [account], loan_account: [account] }
        ]
      }
    }
    const key = unstable_serialize([endpoint, sheet ? JSON.stringify({ user_id: '' }) : null])
    const { container } = mount(<Page />, { fallback: { [key]: response } })
    await screen.findByRole('alert')
    expect(screen.getByText('mobile.stale_collection_data')).toBeTruthy()
    expect(container.querySelector('.staff-table')).not.toBeNull()
    expect(
      screen.getAllByText(sheet ? 'Recorded member' : 'Recorded field').length
    ).toBeGreaterThan(0)
  })
})
