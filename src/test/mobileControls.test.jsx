import { fireEvent, render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { authDataState } from '../atoms/authAtoms'
import ProfileBox from '../components/profileBox/ProfileBox'
import ActionBtnGroup, { MobileTableActionContext } from '../components/utilities/ActionBtnGroup'

describe('Mobile control accessibility', () => {
  it('offers a keyboard-accessible avatar button and Escape dismisses its popover', () => {
    window.innerWidth = 390
    render(
      <RecoilRoot
        initializeState={({ set }) => set(authDataState, { name: 'Employee', role: ['Officer'] })}>
        <MemoryRouter>
          <ProfileBox t={(key) => key} />
        </MemoryRouter>
      </RecoilRoot>
    )
    const button = screen.getByRole('button', { name: 'profile_box.profile' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
  it('labels compact row actions and keeps disabled mutations disabled', () => {
    const remove = vi.fn()
    render(
      <MobileTableActionContext.Provider value>
        <ActionBtnGroup>
          <button aria-label="Edit">Edit</button>
          <button aria-label="Delete" disabled onClick={remove}>
            Delete
          </button>
        </ActionBtnGroup>
      </MobileTableActionContext.Provider>
    )
    const trigger = screen.getByRole('button', { name: 'common.action' })
    fireEvent.click(trigger)
    const denied = screen.getByRole('menuitem', { name: 'Delete' })
    expect(denied.getAttribute('aria-disabled')).toBe('true')
    fireEvent.click(denied)
    expect(remove).not.toHaveBeenCalled()
  })
})
