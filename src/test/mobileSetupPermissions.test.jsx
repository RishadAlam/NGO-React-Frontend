import { act, fireEvent, render, screen } from '@testing-library/react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import { windowInnerWidthState } from '../atoms/windowSize'
import Field from '../pages/field/Field'
import Center from '../pages/center/Center'
import Category from '../pages/category/Category'
import xFetch from '../utilities/xFetch'

const response = vi.hoisted(() => ({
  data: {
    data: [
      {
        id: 7,
        name: 'North branch',
        status: 1,
        description: '',
        group: 'Daily',
        is_default: 0,
        field: { name: 'North' }
      }
    ]
  },
  isLoading: false,
  mutate: vi.fn()
}))
vi.mock('../hooks/useFetch', () => ({ default: () => response }))
vi.mock('../utilities/xFetch', () => ({ default: vi.fn(() => Promise.resolve({ success: true })) }))

let setAuth
function Control() {
  setAuth = useSetRecoilState(authDataState)
  return null
}
function mount(Page, permissions, width = 390) {
  window.innerWidth = width
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(authDataState, { permissions, accessToken: 'Bearer test' })
        set(windowInnerWidthState, width)
      }}>
      <Control />
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    </RecoilRoot>
  )
}

beforeEach(() => vi.clearAllMocks())
describe.each([
  ['field', 'fields', Field, 'field.Field_Registration'],
  ['center', 'centers', Center, 'center.Center_Registration'],
  ['category', 'categories', Category, 'category.Category_Registration']
])('Mobile %s list-only actions', (kind, endpoint, Page, createLabel) => {
  it('shows a readable status instead of an unauthorized mutation switch', () => {
    mount(Page, [`${kind}_list_view`])
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByText('common.active')).toBeTruthy()
    expect(xFetch).not.toHaveBeenCalled()
  })
  it('does not offer registration without the independent registration grant', () => {
    mount(Page, [`${kind}_list_view`, `${kind}_data_update`])
    expect(screen.queryByRole('button', { name: createLabel })).toBeNull()
  })
  it('does not let registration permission change existing record status', () => {
    mount(Page, [`${kind}_registration`])
    expect(screen.getByRole('button', { name: createLabel })).toBeTruthy()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })
  it('retains the status update for the exact authorized grant', async () => {
    mount(Page, [`${kind}_data_update`])
    fireEvent.click(screen.getByRole('checkbox', { name: 'common.status' }))
    expect(xFetch).toHaveBeenCalledWith(
      `${endpoint}/change-status/7`,
      { status: false },
      null,
      'Bearer test',
      null,
      'PUT'
    )
    await act(async () => {})
  })
  it('updates a memoized status cell when permission is revoked', () => {
    mount(Page, [`${kind}_data_update`])
    expect(screen.getByRole('checkbox')).toBeTruthy()
    act(() => setAuth({ permissions: [`${kind}_list_view`], accessToken: 'Bearer test' }))
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByText('common.active')).toBeTruthy()
  })
  it('removes memoized edit controls when update permission is revoked', () => {
    mount(Page, [`${kind}_data_update`])
    expect(screen.getByRole('button', { name: 'common.edit' })).toBeTruthy()
    act(() => setAuth({ permissions: [`${kind}_list_view`], accessToken: 'Bearer test' }))
    expect(screen.queryByRole('button', { name: 'common.edit' })).toBeNull()
  })
  it('closes creation when its independent permission is revoked', () => {
    mount(Page, [`${kind}_registration`])
    fireEvent.click(screen.getByRole('button', { name: createLabel }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    act(() => setAuth({ permissions: [`${kind}_list_view`], accessToken: 'Bearer test' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it.each([768, 1024])('preserves the existing non-mobile controls at %ipx', (width) => {
    mount(Page, [`${kind}_list_view`], width)
    expect(screen.getByRole('checkbox', { hidden: true })).toBeTruthy()
    expect(screen.getByRole('button', { name: createLabel })).toBeTruthy()
  })
})
