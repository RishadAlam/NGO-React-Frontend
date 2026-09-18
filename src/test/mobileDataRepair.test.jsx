import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ReactTable from '../components/utilities/tables/ReactTable'
import {
  AuditReportTableColumns,
  CategoryCollectionLoanReportTableColumns,
  DashSavingCollectionTableColumns,
  FieldCollectionLoanReportTableColumns
} from '../resources/staticData/tableColumns'

const t = (key) => key
const basicColumns = [{ Header: 'Name', accessor: 'name' }]
const records = (length) => Array.from({ length }, (_, id) => ({ id, name: `Member ${id}` }))
const table = (columns, data) => (
  <MemoryRouter>
    <ReactTable title="Records" columns={columns} data={data} />
  </MemoryRouter>
)
const expand = () => {
  const summary = document.querySelector('summary')
  expect(summary).not.toBeNull()
  fireEvent.click(summary)
  expect(summary.parentElement.open).toBe(true)
}

describe('Mobile data repair', () => {
  it.each([CategoryCollectionLoanReportTableColumns, FieldCollectionLoanReportTableColumns])(
    'retains all nested loan amounts with the full factory (%#)',
    (factory) => {
      window.innerWidth = 390
      render(
        table(factory(t, 390), [
          {
            id: 1,
            name: 'North',
            loan_collection: [{ deposit: 123, loan: 456, interest: 789, total: 1368 }]
          }
        ])
      )
      expand()
      for (const amount of ['৳123/-', '৳456/-', '৳789/-', '৳1368/-'])
        expect(screen.getByText(amount)).toBeTruthy()
    }
  )

  it('retains computed audit totals', () => {
    window.innerWidth = 390
    render(
      table(
        AuditReportTableColumns(t, 390, () => null, true),
        [
          {
            id: 1,
            financial_year: '2026',
            data: {
              profit_loss: {
                total_expenses: { net_profits: 123 },
                total_incomes: { net_loss: 456 }
              },
              deposit_expenditure: { total_distributions: { current_fund: 789 } }
            }
          }
        ]
      )
    )
    expand()
    for (const amount of ['৳123/-', '৳456/-', '৳789/-'])
      expect(screen.getByText(amount)).toBeTruthy()
  })

  it('shows dashboard creator and time when those columns are enabled', () => {
    window.innerWidth = 390
    render(
      table(
        DashSavingCollectionTableColumns(
          t,
          600,
          () => null,
          (value) => value
        ),
        [
          {
            id: 1,
            client_registration: { name: 'Amina' },
            category: { name: 'General' },
            author: { name: 'Creator Jane' },
            created_at: '2026-09-18T10:20:00',
            acc_no: 4,
            deposit: 100
          }
        ]
      )
    )
    expand()
    expect(screen.getByText('Creator Jane')).toBeTruthy()
    expect(screen.getByText('10:20 AM')).toBeTruthy()
  })

  it('does not restore hidden or permission-disabled computed cells or empty default cells', () => {
    window.innerWidth = 390
    render(
      table(
        [
          ...basicColumns,
          { Header: 'Empty', accessor: 'empty' },
          { Header: 'Secret', accessor: 'secret', show: false, Cell: () => 'Secret value' },
          { Header: 'Denied', accessor: 'denied', isActionHide: true, Cell: () => 'Denied value' }
        ],
        records(1)
      )
    )
    const row = within(screen.getByRole('listitem'))
    expect(row.queryByText('Empty')).toBeNull()
    expect(row.queryByText('Secret value')).toBeNull()
    expect(row.queryByText('Denied value')).toBeNull()
  })

  it.each([
    [11, 10, 1, 'Member 0'],
    [21, 11, 2, 'Member 10']
  ])('recovers when %i rows shrink to %i', (before, after, clicks, expected) => {
    window.innerWidth = 390
    const view = render(table(basicColumns, records(before)))
    for (let index = 0; index < clicks; index++)
      fireEvent.click(screen.getByRole('button', { name: 'localization.shared.next' }))
    view.rerender(table(basicColumns, records(after)))
    expect(screen.getByText(expected)).toBeTruthy()
    expect(screen.queryByText('common.No_Records_Found')).toBeNull()
  })

  it('recovers through empty data without stranding later records', () => {
    window.innerWidth = 390
    const view = render(table(basicColumns, records(11)))
    fireEvent.click(screen.getByRole('button', { name: 'localization.shared.next' }))
    view.rerender(table(basicColumns, []))
    expect(screen.getByText('common.No_Records_Found')).toBeTruthy()
    view.rerender(table(basicColumns, records(1)))
    expect(screen.getByText('Member 0')).toBeTruthy()
  })

  it('preserves tablet page state at 768px', () => {
    window.innerWidth = 768
    const view = render(table(basicColumns, records(11)))
    fireEvent.click(screen.getByRole('button', { name: 'localization.shared.next' }))
    view.rerender(table(basicColumns, records(10)))
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByText('common.No_Records_Found')).toBeTruthy()
  })
})
