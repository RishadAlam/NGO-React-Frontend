import NavDropdown from './NavDropdown'
import NavItemLink from './NavItemLink'

export default function Nav({ m, setMobileMenuClosed }) {
  return m?.subMenu
    ? m.view && <NavDropdown m={m} setMobileMenuClosed={setMobileMenuClosed} />
    : m.view && <NavItemLink m={m} setMobileMenuClosed={setMobileMenuClosed} />
}
