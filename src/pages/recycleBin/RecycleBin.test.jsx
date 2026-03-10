import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import RecycleBin from './RecycleBin'

const navigateMock = vi.fn()
const mutateMock = vi.fn()
const xFetchMock = vi.fn()

const swrState = {
  foldersData: null,
  itemsData: null,
  foldersError: null,
  itemsError: null,
  foldersLoading: false,
  itemsLoading: false
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}))

vi.mock('swr', () => ({
  default: vi.fn((key) => {
    if (!key) {
      return {
        data: null,
        error: null,
        isLoading: false,
        mutate: mutateMock
      }
    }

    const endpoint = Array.isArray(key) ? key[0] : key

    if (endpoint === 'recycle-bin/folders') {
      return {
        data: swrState.foldersData,
        error: swrState.foldersError,
        isLoading: swrState.foldersLoading,
        mutate: mutateMock
      }
    }

    if (endpoint === 'recycle-bin/items') {
      return {
        data: swrState.itemsData,
        error: swrState.itemsError,
        isLoading: swrState.itemsLoading,
        mutate: mutateMock
      }
    }

    return {
      data: null,
      error: null,
      isLoading: false,
      mutate: mutateMock
    }
  })
}))

vi.mock('../../utilities/xFetch', () => ({
  default: (...args) => xFetchMock(...args)
}))

vi.mock('../../atoms/authAtoms', () => ({
  useAuthDataValue: vi.fn()
}))

vi.mock('../../atoms/loaderAtoms', () => ({
  useLoadingState: vi.fn()
}))

vi.mock('../../helper/deleteAlert', () => ({
  permanentDeleteAlert: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  passwordCheckAlert: vi.fn(() => Promise.resolve({ isConfirmed: true }))
}))

describe('RecycleBin Page', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    window.localStorage.clear()

    const { useAuthDataValue } = await import('../../atoms/authAtoms')
    const { useLoadingState } = await import('../../atoms/loaderAtoms')

    useLoadingState.mockReturnValue([{}, vi.fn()])
    useAuthDataValue.mockReturnValue({
      accessToken: 'Bearer test-token',
      permissions: ['recycle_bin_view', 'recycle_bin_restore', 'recycle_bin_force_delete']
    })

    swrState.foldersData = {
      data: {
        folders: [
          {
            type: 'field',
            label: 'Field',
            total_items: 1,
            last_deleted_at: '2026-03-10T00:00:00Z',
            last_deleted_at_unix: 1773100800
          }
        ]
      }
    }
    swrState.itemsData = {
      data: {
        module: { value: 'field', label: 'Field' },
        items: [
          {
            id: 11,
            type: 'field',
            type_label: 'Field',
            display_name: 'Field 01',
            deleted_at: '2026-03-10T00:00:00Z',
            deleted_by: { id: 1, name: 'Admin' },
            metadata: { description: 'Some field' },
            restorable: true,
            force_deletable: true
          }
        ],
        pagination: {
          current_page: 1,
          per_page: 1,
          total: 1,
          last_page: 1
        }
      }
    }
    swrState.foldersError = null
    swrState.itemsError = null
    swrState.foldersLoading = false
    swrState.itemsLoading = false

    xFetchMock.mockResolvedValue({ success: true, message: 'Done' })
  })

  const openFieldModuleFolder = () => {
    const fieldFolderButton = screen.getByRole('button', { name: /field/i })
    fireEvent.click(fieldFolderButton)
  }

  it('renders recycle bin folders and filters', () => {
    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    expect(screen.getByText('recycle_bin.title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('recycle_bin.search_placeholder')).toBeInTheDocument()
    expect(screen.getByText('Field')).toBeInTheDocument()

    openFieldModuleFolder()
    expect(screen.getByText('Field 01')).toBeInTheDocument()
  })

  it('switches between list and grid view modes', () => {
    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    const listButton = screen.getByRole('button', { name: /recycle_bin.view_list/i })
    const gridButton = screen.getByRole('button', { name: /recycle_bin.view_grid/i })

    expect(gridButton.className.includes('btn-primary')).toBe(true)
    fireEvent.click(listButton)
    expect(listButton.className.includes('btn-primary')).toBe(true)
  })

  it('persists view mode in local storage', () => {
    window.localStorage.setItem('recycle_bin_view_mode', 'list')

    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    const listButton = screen.getByRole('button', { name: /recycle_bin.view_list/i })
    const gridButton = screen.getByRole('button', { name: /recycle_bin.view_grid/i })

    expect(listButton.className.includes('btn-primary')).toBe(true)
    fireEvent.click(gridButton)
    expect(window.localStorage.getItem('recycle_bin_view_mode')).toBe('grid')
  })

  it('shows total records and load more based on per-page limit', () => {
    const generatedItems = Array.from({ length: 13 }, (_, index) => {
      const recordId = 101 + index

      return {
        id: recordId,
        type: 'field',
        type_label: 'Field',
        display_name: `Field ${recordId}`,
        deleted_at: `2026-03-${String(index + 1).padStart(2, '0')}T00:00:00Z`,
        deleted_by: { id: 1, name: 'Admin' },
        metadata: {},
        restorable: true,
        force_deletable: true
      }
    })

    swrState.foldersData = {
      data: {
        folders: [
          {
            type: 'field',
            label: 'Field',
            total_items: 13,
            last_deleted_at: '2026-03-10T00:00:00Z',
            last_deleted_at_unix: 1773100800
          }
        ]
      }
    }
    swrState.itemsData = {
      data: {
        module: { value: 'field', label: 'Field' },
        items: generatedItems
      }
    }

    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    openFieldModuleFolder()

    fireEvent.change(screen.getByLabelText('recycle_bin.per_page_limit'), {
      target: { value: '12' }
    })

    expect(screen.getByText('recycle_bin.total_records')).toBeInTheDocument()
    expect(screen.getByText('recycle_bin.showing_records')).toBeInTheDocument()
    expect(screen.getByText('Field 113')).toBeInTheDocument()
    expect(screen.queryByText('Field 101')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /recycle_bin.load_more/i }))
    expect(screen.getByText('Field 101')).toBeInTheDocument()
  })

  it('filters records by subfolder filters', () => {
    swrState.foldersData = {
      data: {
        folders: [
          {
            type: 'saving_account',
            label: 'Saving Account',
            total_items: 1,
            last_deleted_at: '2026-03-10T00:00:00Z',
            last_deleted_at_unix: 1773100800
          }
        ]
      }
    }
    swrState.itemsData = {
      data: {
        module: { value: 'saving_account', label: 'Saving Account' },
        items: [
          {
            id: 41,
            type: 'saving_account',
            type_label: 'Saving Account',
            display_name: 'SA-00041',
            image_uri: 'https://example.com/client-101.jpg',
            deleted_at: '2026-03-10T00:00:00Z',
            deleted_by: { id: 1, name: 'Admin' },
            metadata: {
              field: 'Field A',
              center: 'Center 1',
              category: 'Category 1',
              client: 'Client 101'
            },
            restorable: true,
            force_deletable: true
          },
          {
            id: 42,
            type: 'saving_account',
            type_label: 'Saving Account',
            display_name: 'SA-00042',
            deleted_at: '2026-03-10T00:00:00Z',
            deleted_by: { id: 1, name: 'Admin' },
            metadata: {
              field: 'Field B',
              center: 'Center 2',
              category: 'Category 2',
              client: 'Client 102'
            },
            restorable: true,
            force_deletable: true
          }
        ]
      }
    }

    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /saving account/i }))

    const fieldFilterSelect = screen.getByLabelText('recycle_bin.metadata_labels.field')
    fireEvent.change(fieldFilterSelect, { target: { value: 'Field A' } })
    const centerFilterSelect = screen.getByLabelText('recycle_bin.metadata_labels.center')

    expect(screen.queryByLabelText('recycle_bin.metadata_labels.client')).not.toBeInTheDocument()
    expect(screen.getByText('SA-00041')).toBeInTheDocument()
    expect(screen.getByText('Client 101')).toBeInTheDocument()
    expect(screen.getByText(/recycle_bin.metadata_labels.account_no/i)).toBeInTheDocument()
    expect(screen.getByAltText('recycle_bin.record_image_alt')).toBeInTheDocument()
    expect(screen.queryByText('SA-00042')).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Center 1' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Center 2' })).not.toBeInTheDocument()
    expect(centerFilterSelect).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /recycle_bin.view_list/i }))
    expect(screen.getByText('Client 101')).toBeInTheDocument()
    expect(screen.getByText('recycle_bin.metadata_labels.account_no: SA-00041')).toBeInTheDocument()
  })

  it('calls restore API when restore action is clicked', async () => {
    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    openFieldModuleFolder()
    const restoreButtons = screen.getAllByRole('button')
    fireEvent.click(restoreButtons.find((button) => button.className.includes('text-success')))

    await waitFor(() => {
      expect(xFetchMock).toHaveBeenCalledWith(
        'recycle-bin/field/11/restore',
        null,
        null,
        'Bearer test-token',
        null,
        'POST'
      )
    })
  })

  it('calls force delete API when permanent delete action is confirmed', async () => {
    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    openFieldModuleFolder()
    const actionButtons = screen.getAllByRole('button')
    fireEvent.click(actionButtons.find((button) => button.className.includes('text-danger')))

    await waitFor(() => {
      expect(xFetchMock).toHaveBeenCalledWith(
        'recycle-bin/field/11/force',
        null,
        null,
        'Bearer test-token',
        null,
        'DELETE'
      )
    })
  })

  it('hides action buttons if user lacks restore and force delete permissions', async () => {
    const { useAuthDataValue } = await import('../../atoms/authAtoms')
    useAuthDataValue.mockReturnValue({
      accessToken: 'Bearer test-token',
      permissions: ['recycle_bin_view']
    })

    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    openFieldModuleFolder()
    const buttons = screen.getAllByRole('button')
    expect(buttons.some((button) => button.className.includes('text-success'))).toBe(false)
    expect(buttons.some((button) => button.className.includes('text-danger'))).toBe(false)
  })

  it('navigates to unauthorized page when backend returns 403', async () => {
    swrState.foldersError = { status: 403, message: 'This action is unauthorized.' }

    render(
      <MemoryRouter>
        <RecycleBin />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/unauthorized')
    })
  })
})
