import { fireEvent, render, screen } from '@testing-library/react'
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
