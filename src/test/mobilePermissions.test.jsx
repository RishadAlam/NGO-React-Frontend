import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import { authDataState } from '../atoms/authAtoms'
import MobileQuickActions from '../components/mobile/MobileQuickActions'
import ReactTable from '../components/utilities/tables/ReactTable'
import {
  createTableColumnVisibilityStorageKey,
  getColumnVisibilitySignature
} from '../helper/tableColumnVisibility'

const bridge = vi.hoisted(() => ({ auth: {} }))
vi.mock('recoil-nexus', () => ({ default: () => null, getRecoil: () => bridge.auth }))
let updateAuth
function AfterNexus({ children }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready ? children : null
}
function AuthControl() {
  bridge.auth = useRecoilValue(authDataState)
  updateAuth = useSetRecoilState(authDataState)
  return null
}
function mountWithPermissions(element, permissions) {
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { id: 1, permissions })}>
      <RecoilNexus />
      <AuthControl />
      <AfterNexus>
        <MemoryRouter initialEntries={['/services']}>{element}</MemoryRouter>
      </AfterNexus>
    </RecoilRoot>
  )
}
beforeEach(() => {
  window.innerWidth = 390
})

describe('Mobile service permissions', () => {
  it.each([
    ['saving_acc_registration', '/registration/saving-account'],
    ['loan_acc_registration', '/registration/loan-account'],
    ['income_list_view', '/accounts/incomes'],
    ['expense_category_list_view', '/accounts/expenses/categories'],
    ['categories_config', '/settings-and-privacy/categories-config']
  ])('keeps an independently granted submenu accessible: %s', (permission, path) => {
    const { container } = mountWithPermissions(<MobileQuickActions />, [permission])
    expect(container.querySelector(`a[href="${path}"]`)).not.toBeNull()
    expect(container.querySelectorAll('a').length).toBe(1)
  })

  it('updates cached services immediately when privileges are revoked or granted', () => {
    const { container } = mountWithPermissions(<MobileQuickActions />, ['analytics_dashboard_view'])
    expect(container.querySelector('a[href="/analytics"]')).not.toBeNull()
    act(() => updateAuth({ id: 1, permissions: ['recycle_bin_view'] }))
    expect(container.querySelector('a[href="/analytics"]')).toBeNull()
    expect(container.querySelector('a[href="/recycle-bin"]')).not.toBeNull()
  })

  it('does not expose approval children without their parent permission', () => {
    const { container } = mountWithPermissions(<MobileQuickActions />, [])
    expect(container.querySelector('a[href^="/pending/"]')).toBeNull()
    expect(screen.getByRole('status')).toBeTruthy()
  })

  it('navigates when a quick service is clicked, including non-first tiles', async () => {
    const { container } = mountWithPermissions(
      <Routes>
        <Route path="/services" element={<MobileQuickActions />} />
        <Route path="/analytics" element={<h1>Analytics destination</h1>} />
      </Routes>,
      ['client_registration', 'analytics_dashboard_view']
    )
    fireEvent.click(container.querySelector('a[href="/analytics"]'))
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Analytics destination' })).toBeTruthy()
    )
  })

  it('closes a revoked open group and releases the scroll lock', async () => {
    mountWithPermissions(<MobileQuickActions />, ['field_list_view', 'center_list_view'])
    fireEvent.click(screen.getByRole('button', { name: 'menu.categories.Control_Panel' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    act(() => updateAuth({ id: 1, permissions: [] }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.body.style.overflow).toBe('')
  })
})

describe('Mobile table permission parity', () => {
  const columns = [
    { Header: 'Name', accessor: 'name' },
    {
      Header: 'Approval',
      accessor: 'is_approved',
      show: true,
      isActionHide: false,
      Cell: () => <button>Approve collection</button>
    },
    {
      Header: 'Actions',
      accessor: 'action',
      show: false,
      isActionHide: false,
      Cell: () => <button>Edit collection</button>
    }
  ]

  it('exposes mobile cards as a labelled list instead of a table without cells', () => {
    mountWithPermissions(
      <ReactTable title="Collections" columns={columns} data={[{ name: 'Member' }]} />,
      []
    )
    expect(screen.getByRole('list', { name: 'Collections' })).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it.each([768, 1024, 1440])(
    'keeps the native table, serial column and search at %i px',
    (width) => {
      window.innerWidth = width
      const { container } = mountWithPermissions(
        <ReactTable
          title="Collections"
          columns={[{ Header: '#', accessor: 'serial' }, ...columns]}
          data={[{ name: 'Member', serial: 1 }]}
        />,
        []
      )
      expect(container.querySelector('table')).not.toBeNull()
      expect(container.querySelector('.mobile-data-list')).toBeNull()
      expect(screen.getByText('#')).toBeTruthy()
      expect(screen.getByRole('searchbox')).toBeTruthy()
      expect(screen.queryByRole('button', { name: 'Edit collection' })).toBeNull()
    }
  )

  it('keeps approvals and row actions available together, even without an action value', () => {
    mountWithPermissions(
      <ReactTable
        title="Collections"
        columns={columns}
        data={[{ name: 'Member', is_approved: false }]}
      />,
      []
    )
    expect(screen.getByRole('button', { name: 'Approve collection' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Edit collection' })).toBeTruthy()
  })

  it('ignores saved column preferences that try to restore forbidden actions', () => {
    const deniedColumns = columns.map((c) =>
      c.accessor === 'action' ? { ...c, show: false, disable: true, isActionHide: true } : c
    )
    const mobileColumns = deniedColumns.filter((column) => column.isActionHide !== true)
    const storageKey = createTableColumnVisibilityStorageKey(
      'react_table_mobile',
      '#',
      '#',
      getColumnVisibilitySignature(mobileColumns)
    )
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ name: true, is_approved: true, action: true })
    )
    // Also cover a preference saved before the action permission was revoked.
    window.localStorage.setItem(
      createTableColumnVisibilityStorageKey(
        'react_table_mobile',
        '#',
        '#',
        getColumnVisibilitySignature(deniedColumns)
      ),
      JSON.stringify({ name: true, is_approved: true, action: true })
    )
    const readPreference = vi.spyOn(Storage.prototype, 'getItem')
    mountWithPermissions(
      <ReactTable
        title="Collections"
        columns={deniedColumns}
        data={[{ name: 'Member', is_approved: false, action: 'present' }]}
      />,
      []
    )
    expect(readPreference).toHaveBeenCalledWith(storageKey)
    expect(screen.queryByRole('button', { name: 'Edit collection' })).toBeNull()
    readPreference.mockRestore()
  })
})
