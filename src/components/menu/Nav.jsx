import { memo } from 'react'
import NavDropdown from './NavDropdown'
import NavLink from './NavLink'

function Nav({ m, setMobileMenuClosed }) {
  return m?.subMenu
    ? m.view && <NavDropdown m={m} setMobileMenuClosed={setMobileMenuClosed} />
    : m.view && <NavLink m={m} setMobileMenuClosed={setMobileMenuClosed} />
}

export default memo(Nav)
