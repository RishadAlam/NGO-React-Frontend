import { memo } from 'react'
import NavDropdown from './NavDropdown'
import NavLink from './NavLink'

function Nav({ m, location, setMobileMenuClosed }) {
  return m?.subMenu
    ? m.view && <NavDropdown m={m} location={location} setMobileMenuClosed={setMobileMenuClosed} />
    : m.view && <NavLink m={m} location={location} setMobileMenuClosed={setMobileMenuClosed} />
}

export default memo(Nav)
