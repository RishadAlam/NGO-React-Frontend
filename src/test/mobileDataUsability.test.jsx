import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ReactTable from '../components/utilities/tables/ReactTable'
import {
  RegisteredSavingsTableColumns,
  RegisteredLoanTableColumns,
  CategoryCollectionSavingReportTableColumns,
  FieldCollectionSavingReportTableColumns,
  CategoryCollectionLoanReportTableColumns,
  FieldCollectionLoanReportTableColumns
} from '../resources/staticData/tableColumns'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, values) => (key === 'mobile.page_of' ? `Page ${values.page} of ${values.total}` : key),
    i18n: { language: 'en' }
  })
}))

const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Amount', accessor: 'amount' },
  { Header: 'Reference', accessor: 'reference', disableSortBy: true }
]
const data = [
  { id: 1, name: 'Zara', amount: 200, reference: 'One' },
  { id: 2, name: 'Amina', amount: 100, reference: 'Two' }
]
function mount(width = 390, records = data, options = {}) {
  window.innerWidth = width
  return render(
    <MemoryRouter>
      <ReactTable title="Accounts" columns={columns} data={records} {...options} />
    </MemoryRouter>
  )
}

describe('Mobile data usability', () => {
  it.each([RegisteredSavingsTableColumns, RegisteredLoanTableColumns])(
    'sorts actual nested member names and omits unsupported object fields (%#)',
    (factory) => {
      mount(
        390,
        [
          { id: 1, client_registration: { name: 'Zara' }, field: { name: 'North' } },
          { id: 2, client_registration: { name: 'Amina' }, field: { name: 'South' } }
        ],
        {
          columns: factory(
            (key) => key,
            390,
            () => null
          ).filter((column) => ['name', 'field'].includes(column.accessor))
        }
      )
      const sort = screen.getByRole('combobox', { name: 'mobile.sort_by' })
      fireEvent.change(sort, { target: { value: 'name' } })
      expect(screen.getAllByRole('listitem')[0].textContent).toContain('Amina')
      expect(within(sort).queryByRole('option', { name: 'common.field' })).toBeNull()
    }
  )

  it.each([
    [CategoryCollectionSavingReportTableColumns, 'saving_collection'],
    [FieldCollectionSavingReportTableColumns, 'saving_collection'],
    [CategoryCollectionLoanReportTableColumns, 'deposit'],
    [FieldCollectionLoanReportTableColumns, 'deposit']
  ])('sorts actual nested collection amount values numerically (%#)', (factory, sortId) => {
    mount(
      390,
      [
        {
          id: 1,
          name: 'Zara',
          saving_collection: [{ deposit: '100' }],
          loan_collection: [{ deposit: '100' }]
        },
        {
          id: 2,
          name: 'Amina',
          saving_collection: [{ deposit: '9' }],
          loan_collection: [{ deposit: '9' }]
        }
      ],
      {
        columns: factory((key) => key, 390).filter((column) =>
          ['name', sortId].includes(column.accessor)
        )
      }
    )
    const sort = screen.getByRole('combobox', { name: 'mobile.sort_by' })
    fireEvent.change(sort, { target: { value: sortId } })
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('Amina')
    fireEvent.change(screen.getByRole('combobox', { name: 'mobile.sort_direction' }), {
      target: { value: 'desc' }
    })
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('Zara')
  })

  it('keeps both page arrows available with a compact position on long lists', () => {
    mount(
      390,
      Array.from({ length: 300 }, (_, index) => ({
        id: index,
        name: `Member ${index}`,
        amount: index
      }))
    )
    const pagination = screen.getByRole('navigation', { name: 'mobile.pagination' })
    expect(within(pagination).getAllByRole('button')).toHaveLength(2)
    expect(within(pagination).getByText('Page 1 of 30')).toBeTruthy()
    expect(
      within(pagination).getByRole('button', { name: 'localization.shared.previous' }).disabled
    ).toBe(true)
    fireEvent.click(within(pagination).getByRole('button', { name: 'localization.shared.next' }))
    expect(within(pagination).getByText('Page 2 of 30')).toBeTruthy()
    expect(screen.getByText('Member 10')).toBeTruthy()
    for (let page = 2; page < 30; page += 1) {
      fireEvent.click(within(pagination).getByRole('button', { name: 'localization.shared.next' }))
    }
    expect(within(pagination).getByText('Page 30 of 30')).toBeTruthy()
    expect(
      within(pagination).getByRole('button', { name: 'localization.shared.next' }).disabled
    ).toBe(true)
    expect(screen.getByText('Member 290')).toBeTruthy()
  })

  it('sorts mobile records in both directions without exposing disabled columns or search', () => {
    mount()
    const sort = screen.getByRole('combobox', { name: 'mobile.sort_by' })
    expect(within(sort).queryByRole('option', { name: 'Reference' })).toBeNull()
    fireEvent.change(sort, { target: { value: 'name' } })
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('Amina')
    fireEvent.change(screen.getByRole('combobox', { name: 'mobile.sort_direction' }), {
      target: { value: 'desc' }
    })
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('Zara')
    fireEvent.change(sort, { target: { value: '' } })
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('Zara')
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('gives navigable record identities real links and keeps ordinary rows non-interactive', () => {
    const result = mount(390, data, { rowLinkPath: '/accounts', rowLinkPrefix: 'id' })
    expect(screen.getByRole('link', { name: 'Zara' }).getAttribute('href')).toBe('/accounts/1')
    expect(screen.getAllByRole('listitem')[0].hasAttribute('tabindex')).toBe(false)
    result.unmount()
    mount()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('keeps mutation action columns out of sorting without hiding the actions', () => {
    mount(390, data, {
      columns: [
        ...columns,
        { Header: 'Action', accessor: 'action', Cell: () => <button type="button">Edit</button> }
      ]
    })
    expect(
      within(screen.getByRole('combobox', { name: 'mobile.sort_by' })).queryByRole('option', {
        name: 'Action'
      })
    ).toBeNull()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2)
  })

  it('does not expose internal IDs as labels for unnamed sort columns', () => {
    mount(390, data, {
      columns: [
        ...columns,
        { Header: <span />, accessor: 'internal_reference' },
        { Header: ' ', accessor: 'internal_code' }
      ]
    })
    const sort = screen.getByRole('combobox', { name: 'mobile.sort_by' })
    expect(
      within(sort)
        .getAllByRole('option')
        .map((option) => option.textContent)
    ).toEqual(['mobile.default_order', 'Name', 'Amount'])
  })

  it('retains desktop table controls and numbered pagination at the 768px boundary', () => {
    mount(
      768,
      Array.from({ length: 60 }, (_, index) => ({
        id: index,
        name: `Member ${index}`,
        amount: index
      }))
    )
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.queryByRole('combobox', { name: 'mobile.sort_by' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'mobile.pagination' })).toBeNull()
    expect(screen.getAllByRole('button').length).toBeGreaterThan(4)
  })
})
