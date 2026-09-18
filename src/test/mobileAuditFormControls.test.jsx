import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'
import { beforeEach, expect, it, vi } from 'vitest'
import TextInputField from '../components/utilities/TextInputField'
import RadioInputGroup from '../components/utilities/RadioInputGroup'
import CategoryConfigRow from '../components/categoriesConfig/CategoryConfigRow'
import Nominees from '../components/savingAccRegistration/Nominees'
import Guarantors from '../components/loanAccRegistration/Guarantors'
import SearchAccount from '../pages/searchAccount/SearchAccount'
import InternalAuditReport from '../pages/audit/InternalAuditReport'

vi.mock('../utilities/xFetch', () => ({ default: vi.fn(() => new Promise(() => {})) }))

beforeEach(() => {
  window.innerWidth = 390
})

function mount(element) {
  return render(
    <RecoilRoot>
      <SWRConfig value={{ provider: () => new Map() }}>
        <MemoryRouter>{element}</MemoryRouter>
      </SWRConfig>
    </RecoilRoot>
  )
}

it.each([390, 768])('only honors requested autofocus outside phone layouts (%i)', (width) => {
  window.innerWidth = width
  render(<TextInputField label="Account" autoFocus defaultValue="" setChange={() => {}} />)
  expect(document.activeElement === screen.getByRole('textbox', { name: 'Account' })).toBe(
    width === 768
  )
})

it('links each radio validation message to its own group without changing selection', () => {
  const change = vi.fn()
  render(
    <>
      <RadioInputGroup
        label="Religion"
        options={[{ label: 'Islam', value: 'islam' }]}
        error="Select religion"
        setChange={change}
      />
      <RadioInputGroup label="Gender" error="Select gender" />
    </>
  )
  const groups = screen.getAllByRole('radiogroup')
  for (const [i, message] of ['Select religion', 'Select gender'].entries()) {
    expect(groups[i].getAttribute('aria-invalid')).toBe('true')
    expect(document.getElementById(groups[i].getAttribute('aria-describedby'))?.textContent).toBe(
      message
    )
  }
  expect(groups[0].getAttribute('aria-describedby')).not.toBe(
    groups[1].getAttribute('aria-describedby')
  )
  fireEvent.click(screen.getByRole('radio', { name: 'Islam' }))
  expect(change).toHaveBeenCalledWith('islam')
})

it('names the search field and icon submit with existing translations', () => {
  mount(<SearchAccount />)
  expect(screen.getByRole('textbox', { name: 'common.search_placeholder' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'common.search' }).type).toBe('submit')
})

it.each([
  [Nominees, 'nominees', 'nominee'],
  [Guarantors, 'guarantors', 'guarantor']
])('names add/remove controls for %s', (Component, key, label) => {
  render(<Component formData={{ [key]: [] }} setFormData={() => {}} setErrors={() => {}} />)
  expect(screen.getByRole('button', { name: `common.add_${label}` }).disabled).toBe(false)
  expect(screen.getByRole('button', { name: `common.remove_${label}` }).disabled).toBe(true)
})

it('distinguishes category switches and retains their update keys', () => {
  const change = vi.fn()
  render(
    <CategoryConfigRow
      config={{ category: { name: 'Gold', is_default: false } }}
      index={2}
      accounts={[]}
      setChange={change}
    />
  )
  const savings = screen.getByRole('checkbox', {
    name: 'Gold: categories_config.disable_unchecked_accounts: categories_config.field_labels.savings_account'
  })
  expect(
    screen.getByRole('checkbox', {
      name: 'Gold: categories_config.disable_unchecked_accounts: categories_config.field_labels.loan_account'
    })
  ).toBeTruthy()
  fireEvent.click(savings)
  expect(change).toHaveBeenCalledWith(true, 'disable_unchecked_saving_acc', 2)
})

it('associates audit filter labels with stable distinct input IDs', () => {
  mount(<InternalAuditReport />)
  const from = screen.getByLabelText('audit_report_page.internal.filters.from_date')
  const to = screen.getByLabelText('audit_report_page.internal.filters.to_date')
  const field = screen.getByRole('combobox', { name: 'common.field' })
  const center = screen.getByRole('combobox', { name: 'common.center' })
  expect(new Set([from.id, to.id, field.id, center.id]).size).toBe(4)
  const id = from.id
  fireEvent.change(from, { target: { value: '2026-09-01' } })
  expect(screen.getByLabelText('audit_report_page.internal.filters.from_date').id).toBe(id)
  expect(from.value).toBe('2026-09-01')
})

it('leaves desktop search, repeatable controls, radio errors and audit labels unchanged at 768px', () => {
  window.innerWidth = 768
  const { container } = mount(
    <>
      <SearchAccount />
      <Nominees formData={{ nominees: [] }} />
      <Guarantors formData={{ guarantors: [] }} />
      <RadioInputGroup label="Religion" error="Required" />
      <InternalAuditReport />
    </>
  )
  expect(
    screen.getByPlaceholderText('common.search_placeholder').getAttribute('aria-label')
  ).toBeNull()
  expect(container.querySelector('.mainSearchBox button').getAttribute('aria-label')).toBeNull()
  expect(screen.queryByRole('button', { name: 'common.add_nominee' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'common.add_guarantor' })).toBeNull()
  expect(screen.getByRole('radiogroup').getAttribute('aria-describedby')).toBeNull()
  expect(screen.getByRole('radiogroup').getAttribute('aria-invalid')).toBeNull()
  container
    .querySelectorAll('.audit-filter-form input, .audit-filter-form select')
    .forEach((input) => expect(input.id).toBe(''))
})
