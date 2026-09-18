import { fireEvent, render, screen, within } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import SavingRow from '../components/collection/SavingCollectionSheetRow'
import LoanRow from '../components/collection/LoanCollectionSheetRow'

vi.mock('../components/collection/SavingCollectionModal', () => ({
  default: () => <div data-testid="collection-form" />
}))
vi.mock('../components/collection/LoanCollectionModal', () => ({
  default: () => <div data-testid="collection-form" />
}))

const account = { id: 1, acc_no: 42, payable_deposit: 200, client_registration: { name: 'Member' } }
const collection = { id: 9, deposit: 100, loan: 20, interest: 5, total: 125, is_approved: false }
function mount(Row, permissions, props = {}) {
  window.innerWidth = 390
  return render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { permissions })}>
      <table>
        <tbody>
          <Row
            account={account}
            isMobileSheet
            columnList={{}}
            approvedList={[]}
            setApprovedList={vi.fn()}
            {...props}
          />
        </tbody>
      </table>
    </RecoilRoot>
  )
}
describe.each([
  ['saving', SavingRow],
  ['loan', LoanRow]
])('Mobile %s collection privileges', (kind, Row) => {
  it('labels a pending row without a collection as an estimate, not today’s money', () => {
    mount(Row, [], { isRegular: false })
    const card = screen.getByRole('article')
    expect(within(card).queryAllByText('common.due_today')).toHaveLength(0)
    expect(within(card).getByText('common.estimate_collection')).toBeTruthy()
    expect(card.querySelector('.collection-sheet-mobile-card__status')).toBeNull()
    expect(card.querySelector('.collection-sheet-mobile-card__payment strong').textContent).toBe(
      '৳200/-'
    )
  })

  it('keeps today’s due label on regular collection rows', () => {
    mount(Row, [], { isRegular: true })
    expect(screen.getAllByText('common.due_today')).toHaveLength(2)
  })

  it('keeps an actual historical collection marked collected with its recorded amount', () => {
    mount(Row, [], {
      isRegular: false,
      collection: { ...collection, created_at: '2026-04-11T10:00:00.000Z' }
    })
    const card = screen.getByRole('article')
    expect(within(card).getByText('common.collected')).toBeTruthy()
    expect(within(card).getByText('common.collected_amount')).toBeTruthy()
    expect(within(card).queryByText('common.due_today')).toBeNull()
    expect(card.querySelector('.collection-sheet-mobile-card__payment strong').textContent).toBe(
      kind === 'saving' ? '৳100/-' : '৳125/-'
    )
  })

  it('leaves the desktop pending row as the existing table cells', () => {
    mount(Row, [], { isRegular: false, isMobileSheet: false })
    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.queryByText('common.estimate_collection')).toBeNull()
    expect(screen.getByRole('row').className).toBe('collection-sheet-desktop-row')
  })

  it('keeps a read-only employee free of mutation controls', () => {
    mount(Row, [], { collection })
    expect(screen.queryByRole('button', { name: 'common.edit_collection' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'common.delete' })).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.queryByTestId('collection-form')).toBeNull()
  })
  it('mounts the money form only when an authorized employee opens it', () => {
    mount(Row, [`permission_to_do_${kind}_collection`])
    expect(screen.queryByTestId('collection-form')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'common.collect_money' }))
    expect(screen.getByTestId('collection-form')).toBeTruthy()
  })
  it('does not use create permission to edit an existing collection', () => {
    mount(Row, [`permission_to_do_${kind}_collection`], { collection })
    expect(screen.queryByRole('button', { name: 'common.edit_collection' })).toBeNull()
  })
  it.each([true, false])('uses the exact regular/pending permissions (regular=%s)', (isRegular) => {
    const prefix = isRegular ? 'regular' : 'pending'
    mount(
      Row,
      [
        `${prefix}_${kind}_collection_update`,
        `${prefix}_${kind}_collection_approval`,
        `${prefix}_${kind}_collection_permanently_delete`
      ],
      { collection, isRegular }
    )
    expect(screen.getByRole('button', { name: 'common.edit_collection' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'common.delete' })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'common.approval' })).toBeTruthy()
  })
  it('does not grant pending actions from regular permissions', () => {
    mount(
      Row,
      [
        `permission_to_do_${kind}_collection`,
        `regular_${kind}_collection_update`,
        `regular_${kind}_collection_approval`,
        `regular_${kind}_collection_permanently_delete`
      ],
      { collection, isRegular: false }
    )
    expect(screen.queryByRole('button', { name: 'common.edit_collection' })).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })
})
