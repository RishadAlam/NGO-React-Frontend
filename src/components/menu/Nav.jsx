import NavDropdown from './NavDropdown'
import NavLink from './NavLink'

export default function Nav({ m, location, setMobileMenuClosed }) {
  return m?.subMenu
    ? m.view && <NavDropdown m={m} location={location} setMobileMenuClosed={setMobileMenuClosed} />
    : m.view && <NavLink m={m} location={location} setMobileMenuClosed={setMobileMenuClosed} />
}
