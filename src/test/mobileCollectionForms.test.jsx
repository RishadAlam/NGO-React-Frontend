import { fireEvent, render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import SavingForm from '../components/collection/SavingCollectionModal'
import LoanForm from '../components/collection/LoanCollectionModal'
import xFetch from '../utilities/xFetch'

vi.mock('../hooks/useFetch', () => ({ default: () => ({ data: { data: [] } }) }))
vi.mock('../utilities/xFetch', () => ({ default: vi.fn() }))
vi.mock('../components/utilities/TextAreaInputField', () => ({
  default: () => <textarea aria-label="Description" />
}))
const mount = (Form, permissions, options = {}) => {
  window.innerWidth = 390
  const close = vi.fn()
  const result = render(
    <RecoilRoot initializeState={({ set }) => set(authDataState, { permissions })}>
      <Form
        open
        setOpen={close}
        collectionData={{ newCollection: false }}
        mutate={vi.fn()}
        isRegular={false}
        {...options}
      />
    </RecoilRoot>
  )
  return { ...result, close }
}
describe.each([
  ['saving', SavingForm],
  ['loan', LoanForm]
])('Mobile %s money form', (kind, Form) => {
  it('does not expose an unauthorized form even if its open state is stale', () => {
    mount(Form, [])
    expect(screen.queryByRole('button', { name: 'common.edit_collection' })).toBeNull()
    expect(xFetch).not.toHaveBeenCalled()
  })
  it('has an accessible name and keeps a pending form open on validation failure', () => {
    const { close } = mount(Form, [`pending_${kind}_collection_update`])
    expect(screen.getByRole('dialog', { name: 'common.edit_collection' })).toBeTruthy()
    fireEvent.submit(screen.getByRole('button', { name: 'common.edit_collection' }).closest('form'))
    expect(close).not.toHaveBeenCalled()
    expect(xFetch).not.toHaveBeenCalled()
  })
})
