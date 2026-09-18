import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import PasswordInputField from '../components/utilities/PasswordInputField'
import SelectBoxField from '../components/utilities/SelectBoxField'
import SelectDropdownField from '../components/utilities/SelectDropdownField'
import DatePickerInputField from '../components/utilities/DatePickerInputField'
import TextAreaInputField from '../components/utilities/TextAreaInputField'
import RadioInputGroup from '../components/utilities/RadioInputGroup'
import Button from '../components/utilities/Button'
import XCircle from '../icons/XCircle'
import Login from '../pages/login/Login'
import ResetPassword from '../components/resetPassword/ResetPassword'
import ImagePreview from '../components/utilities/ImagePreview'
import TransactionConfigRow from '../components/approvalConfigs/TransactionConfigRow'
import ApprovalConfigs from '../components/approvalConfigs/ApprovalConfigs'

beforeEach(() => {
  window.innerWidth = 390
  document.execCommand = vi.fn(() => false)
})

const description = (input) =>
  (input.getAttribute('aria-describedby') || '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent || '')
    .join(' ')

describe('mobile field accessibility', () => {
  it('names repeated password fields independently and associates their errors', () => {
    render(
      <>
        <PasswordInputField label="Password" error="Too short" setChange={() => {}} />
        <PasswordInputField label="Confirm password" error="Does not match" setChange={() => {}} />
      </>
    )
    const password = screen.getByLabelText(/^Password/)
    const confirmation = screen.getByLabelText(/^Confirm password/)
    expect(password.id).not.toBe(confirmation.id)
    expect(description(password)).toBe('Too short')
    expect(description(confirmation)).toBe('Does not match')
    expect(password.getAttribute('aria-invalid')).toBe('true')
  })

  it('associates autocomplete errors and clears invalid state without changing its value', () => {
    const config = { options: ['Cash'], value: 'Cash' }
    const { rerender } = render(
      <SelectBoxField label="Account" config={config} error="Choose an active account" />
    )
    const input = screen.getByRole('combobox', { name: 'Account' })
    expect(description(input)).toBe('Choose an active account')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    rerender(<SelectBoxField label="Account" config={config} />)
    expect(input.getAttribute('aria-invalid')).toBe('false')
    expect(input.value).toBe('Cash')
  })

  it('gives multiple dropdowns independent labels and error descriptions', () => {
    render(
      <>
        <SelectDropdownField
          label="Role"
          defaultValue=""
          error="Choose a role"
          setChange={() => {}}
        />
        <SelectDropdownField
          label="Category"
          defaultValue=""
          error="Choose a category"
          setChange={() => {}}
        />
      </>
    )
    const role = screen.getByRole('combobox', { name: 'Role' })
    const category = screen.getByRole('combobox', { name: 'Category' })
    expect(role.id).not.toBe(category.id)
    expect(description(role)).toBe('Choose a role')
    expect(description(category)).toBe('Choose a category')
  })

  it('associates date errors without altering the selected date', () => {
    const change = vi.fn()
    const { container } = render(
      <DatePickerInputField
        label="Date"
        defaultValue="2026-09-18"
        error="Date is unavailable"
        setChange={change}
      />
    )
    const input = container.querySelector('input')
    expect(description(input)).toBe('Date is unavailable')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.value).toContain('18/09/2026')
    expect(change).not.toHaveBeenCalled()
  })

  it('associates rich-text errors without altering stored markup', () => {
    const { container, rerender } = render(
      <TextAreaInputField
        label="Address"
        defaultValue="<p>Dhaka</p>"
        error="Address is required"
        setChange={() => {}}
      />
    )
    const editor = container.querySelector('.ql-editor')
    expect(description(editor)).toBe('Address is required')
    expect(editor.getAttribute('aria-invalid')).toBe('true')
    expect(editor.innerHTML).toBe('<p>Dhaka</p>')
    rerender(
      <TextAreaInputField label="Address" defaultValue="<p>Dhaka</p>" setChange={() => {}} />
    )
    expect(editor.getAttribute('aria-invalid')).toBe('false')
  })

  it('preserves the date picker own invalid-date announcement without a server error', () => {
    const { container } = render(
      <DatePickerInputField label="Date" defaultValue="invalid-date" setChange={() => {}} />
    )
    expect(container.querySelector('input').getAttribute('aria-invalid')).toBe('true')
  })

  it('isolates mobile native radio groups while preserving desktop grouping', () => {
    const fields = (
      <form>
        <RadioInputGroup
          label="Religion"
          options={[{ value: 'islam', label: 'Islam' }]}
          setChange={() => {}}
        />
        <RadioInputGroup
          label="Gender"
          options={[{ value: 'female', label: 'Female' }]}
          setChange={() => {}}
        />
      </form>
    )
    const { unmount } = render(fields)
    expect(screen.getByRole('radio', { name: 'Islam' }).name).not.toBe(
      screen.getByRole('radio', { name: 'Female' }).name
    )
    unmount()
    window.innerWidth = 768
    render(fields)
    expect(screen.getByRole('radio', { name: 'Islam' }).name).toBe('row-radio-buttons-group')
    expect(screen.getByRole('radio', { name: 'Female' }).name).toBe('row-radio-buttons-group')
  })

  it('names only otherwise unnamed mobile close-icon buttons', () => {
    const close = vi.fn()
    render(<Button endIcon={<XCircle />} onclick={close} />)
    fireEvent.click(screen.getByRole('button', { name: 'localization.shared.close' }))
    expect(close).toHaveBeenCalledOnce()
  })
})

describe('mobile authentication controls', () => {
  it('offers a named non-submitting login visibility button', () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </RecoilRoot>
    )
    const button = screen.getByRole('button', { name: 'localization.shared.show_password' })
    expect(button.type).toBe('button')
    expect(button.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(button)
    expect(screen.getByLabelText('Password').type).toBe('text')
    expect(
      screen
        .getByRole('button', { name: 'localization.shared.hide_password' })
        .getAttribute('aria-pressed')
    ).toBe('true')
  })

  it('offers independent reset-password visibility buttons', () => {
    render(<ResetPassword userId={1} loading={{}} setLoading={() => {}} />)
    const buttons = screen.getAllByRole('button', { name: 'localization.shared.show_password' })
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0])
    expect(screen.getByLabelText('auth.new_password').type).toBe('text')
    expect(screen.getByLabelText('auth.confirm_password').type).toBe('password')
    expect(buttons[0].type).toBe('button')
  })

  it('connects login validation errors to their fields', () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </RecoilRoot>
    )
    const email = screen.getByLabelText('Email')
    fireEvent.change(email, { target: { value: 'member@example.com' } })
    fireEvent.change(email, { target: { value: '' } })
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(description(email)).toBe('localization.pages.validation.required')
  })

  it('connects reset confirmation errors to the matching field', () => {
    render(<ResetPassword userId={1} loading={{}} setLoading={() => {}} />)
    const confirmation = screen.getByLabelText('auth.confirm_password')
    fireEvent.change(confirmation, { target: { value: 'Different password' } })
    expect(confirmation.getAttribute('aria-invalid')).toBe('true')
    expect(description(confirmation)).toBe('localization.domain.password_mismatch')
  })

  it('keeps explicit button names and desktop icon markup unchanged', () => {
    const { unmount } = render(<Button aria-label="Cancel editing" endIcon={<XCircle />} />)
    expect(screen.getByRole('button', { name: 'Cancel editing' })).toBeTruthy()
    unmount()
    window.innerWidth = 768
    render(<Button endIcon={<XCircle />} />)
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-label')).toBe(null)
    expect(button.className).not.toContain('mobile-dialog-close')
  })

  it('preserves the existing desktop password reveal element and interaction', () => {
    window.innerWidth = 768
    const { container } = render(<ResetPassword userId={1} loading={{}} setLoading={() => {}} />)
    const reveal = container.querySelector('.trailing-icon.is-button')
    expect(reveal.tagName).toBe('SPAN')
    fireEvent.click(reveal)
    expect(screen.getByLabelText('auth.new_password').type).toBe('text')
  })
})

describe('mobile uploads and approval control names', () => {
  it('activates the matching file input for each repeated upload label', () => {
    const { container } = render(
      <>
        <ImagePreview label="Applicant" setImageUri={() => {}} />
        <ImagePreview label="Nominee" setImageUri={() => {}} />
      </>
    )
    const inputs = container.querySelectorAll('input[type="file"]')
    const labels = container.querySelectorAll('label.btn')
    const firstClick = vi.fn()
    const secondClick = vi.fn()
    inputs[0].addEventListener('click', firstClick)
    inputs[1].addEventListener('click', secondClick)
    fireEvent.click(labels[1])
    expect(secondClick).toHaveBeenCalledOnce()
    expect(firstClick).not.toHaveBeenCalled()
    expect(inputs[0].id).not.toBe(inputs[1].id)
  })

  it('names transaction settings by row and column without changing edits', () => {
    const change = vi.fn()
    render(
      <table>
        <tbody>
          <TransactionConfigRow
            config={{
              withdrawal: { approval_required: 1, fee: 5, min: 10, max: 100, account: null }
            }}
            data_key="withdrawal"
            index={0}
            accounts={[]}
            setChange={change}
            loading={false}
            error={{}}
          />
        </tbody>
      </table>
    )
    expect(
      screen.getByRole('checkbox', { name: 'common.withdrawal: common.approval_required' })
    ).toBeTruthy()
    const fee = screen.getByRole('spinbutton', { name: 'common.withdrawal: common.fee' })
    expect(screen.getByRole('spinbutton', { name: 'common.withdrawal: common.min' }).value).toBe(
      '10'
    )
    expect(screen.getByRole('spinbutton', { name: 'common.withdrawal: common.max' }).value).toBe(
      '100'
    )
    expect(screen.getByRole('combobox', { name: 'common.withdrawal: common.account' })).toBeTruthy()
    fireEvent.change(fee, { target: { value: '6' } })
    expect(change).toHaveBeenCalledWith('6', 'fee', 'withdrawal')
  })

  it('keeps contextual labels when optional numeric settings render as switches', () => {
    const change = vi.fn()
    render(
      <table>
        <tbody>
          <TransactionConfigRow
            config={{ withdrawal: { approval_required: 0, fee: 0, min: 0, max: 0, account: null } }}
            data_key="withdrawal"
            index={0}
            accounts={[]}
            setChange={change}
            loading={false}
            error={{}}
          />
        </tbody>
      </table>
    )
    const fee = screen.getByRole('checkbox', { name: 'common.withdrawal: common.fee' })
    expect(screen.getByRole('checkbox', { name: 'common.withdrawal: common.min' })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'common.withdrawal: common.max' })).toBeTruthy()
    fireEvent.click(fee)
    expect(change).toHaveBeenCalledWith(true, 'fee', 'withdrawal')
  })

  it('names approval toggles and registration fees with their existing translated setting names', () => {
    render(
      <RecoilRoot>
        <ApprovalConfigs
          allApprovals={[
            { id: 1, meta_key: 'client_reg_fee', meta_value: 25 },
            { id: 2, meta_key: 'loan_approval', meta_value: true }
          ]}
          isLoading={false}
          setAllApprovals={() => {}}
          mutate={() => {}}
        />
      </RecoilRoot>
    )
    expect(screen.getByRole('textbox', { name: 'approvals_config.client_reg_fee' }).value).toBe(
      '25'
    )
    expect(screen.getByRole('checkbox', { name: 'approvals_config.loan_approval' }).checked).toBe(
      true
    )
  })

  it('leaves desktop transaction input labels and layout markup unchanged', () => {
    window.innerWidth = 768
    const { container } = render(
      <table>
        <tbody>
          <TransactionConfigRow
            config={{
              withdrawal: { approval_required: 1, fee: 5, min: 10, max: 100, account: null }
            }}
            data_key="withdrawal"
            index={0}
            accounts={[]}
            setChange={() => {}}
            loading={false}
            error={{}}
          />
        </tbody>
      </table>
    )
    expect(container.querySelectorAll('td')).toHaveLength(7)
    container.querySelectorAll('input').forEach((input) => {
      expect(input.getAttribute('aria-label')).toBe(null)
    })
    expect(container.querySelectorAll('.input-field-setup')).toHaveLength(3)
  })
})
