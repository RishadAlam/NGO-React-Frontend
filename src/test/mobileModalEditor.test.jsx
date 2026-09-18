import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TextAreaInputField from '../components/utilities/TextAreaInputField'

beforeEach(() => {
  window.innerWidth = 390
  document.execCommand = vi.fn(() => false)
})

const editor = (props = {}) => (
  <TextAreaInputField
    label="Description"
    defaultValue="<p><strong>Dhaka</strong> collection notes</p>"
    setChange={() => {}}
    {...props}
  />
)

describe('mobile modal rich-text disclosure', () => {
  it('starts with basic formatting and reveals all advanced formats without replacing the editor', () => {
    const change = vi.fn()
    const { container } = render(
      <div className="mobile-app-dialog">{editor({ setChange: change })}</div>
    )
    const content = container.querySelector('.ql-editor')
    const toolbar = container.querySelector('.ql-toolbar')
    const storedMarkup = content.innerHTML
    const disclosure = screen.getByRole('button', {
      name: 'localization.shared.editor.more_formatting'
    })
    const advancedGroups = disclosure
      .getAttribute('aria-controls')
      .split(' ')
      .map((id) => document.getElementById(id))
    expect(disclosure.type).toBe('button')
    expect(disclosure.getAttribute('aria-expanded')).toBe('false')
    expect(advancedGroups.length).toBeGreaterThan(0)
    expect(advancedGroups.every((group) => group.hidden)).toBe(true)
    expect(toolbar.querySelector('.ql-bold').closest('[hidden]')).toBeNull()
    expect(toolbar.querySelector('.ql-italic').closest('[hidden]')).toBeNull()
    expect(toolbar.querySelector('.ql-underline').closest('[hidden]')).toBeNull()
    expect(toolbar.querySelector('.ql-image').closest('[hidden]')).not.toBeNull()

    fireEvent.click(disclosure)
    expect(disclosure.getAttribute('aria-expanded')).toBe('true')
    expect(advancedGroups.every((group) => !group.hidden)).toBe(true)
    expect(toolbar.querySelector('.ql-image').closest('[hidden]')).toBeNull()
    expect(toolbar.querySelector('.ql-strike').closest('[hidden]')).toBeNull()
    expect(container.querySelector('.ql-editor')).toBe(content)
    expect(content.innerHTML).toBe(storedMarkup)
    expect(change).not.toHaveBeenCalled()

    fireEvent.click(disclosure)
    expect(disclosure.getAttribute('aria-expanded')).toBe('false')
    expect(advancedGroups.every((group) => group.hidden)).toBe(true)
    expect(container.querySelector('.ql-editor')).toBe(content)
    expect(change).not.toHaveBeenCalled()
  })

  it('keeps read-only notes visible without offering mobile formatting controls', () => {
    const { container } = render(
      <div className="mobile-app-dialog">{editor({ disabled: true })}</div>
    )
    expect(container.querySelector('.ql-toolbar').hidden).toBe(true)
    expect(container.querySelector('.ql-editor').getAttribute('contenteditable')).toBe('false')
    expect(container.querySelector('.ql-editor').innerHTML).toContain('<strong>Dhaka</strong>')
    expect(
      screen.queryByRole('button', { name: 'localization.shared.editor.more_formatting' })
    ).toBeNull()
  })

  it('does not collapse formatting on ordinary mobile pages', () => {
    const { container } = render(<div className="mobile-page-grid">{editor()}</div>)
    expect(container.querySelector('.ql-toolbar [hidden]')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'localization.shared.editor.more_formatting' })
    ).toBeNull()
  })

  it('does not change the tablet toolbar even with a retained mobile ancestor', () => {
    window.innerWidth = 768
    const { container } = render(<div className="mobile-app-dialog">{editor()}</div>)
    expect(container.querySelector('.ql-toolbar [hidden]')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'localization.shared.editor.more_formatting' })
    ).toBeNull()
  })

  it('preserves required and validation announcements while disclosure changes', () => {
    const { container } = render(
      <div className="mobile-app-dialog">{editor({ error: 'Add a note', isRequired: true })}</div>
    )
    const content = container.querySelector('.ql-editor')
    fireEvent.click(
      screen.getByRole('button', { name: 'localization.shared.editor.more_formatting' })
    )
    expect(content.getAttribute('aria-invalid')).toBe('true')
    expect(content.getAttribute('aria-required')).toBe('true')
    expect(document.getElementById(content.getAttribute('aria-describedby')).textContent).toBe(
      'Add a note'
    )
  })
})
