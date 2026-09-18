import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ModalPro from '../components/utilities/ModalPro'

describe('mobile dialog layout boundary', () => {
  it('gives phone dialogs a dedicated layout scope without targeting nested MUI boxes', () => {
    window.innerWidth = 390
    render(
      <ModalPro open handleClose={() => {}} label="Registration">
        <div className="card">
          <div className="MuiBox-root">Nested content</div>
        </div>
      </ModalPro>
    )
    const dialog = screen.getByRole('dialog', { name: 'Registration' })
    expect(dialog.classList.contains('mobile-app-dialog')).toBe(true)
    expect(screen.getByText('Nested content').classList.contains('mobile-app-dialog')).toBe(false)
  })

  it('does not apply the phone layout scope at the tablet boundary', () => {
    window.innerWidth = 768
    render(
      <ModalPro open handleClose={() => {}}>
        <div>Tablet content</div>
      </ModalPro>
    )
    expect(document.querySelector('.mobile-app-dialog')).toBeNull()
  })
})
