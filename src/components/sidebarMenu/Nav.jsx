import NavDropdown from './NavDropdown'
import NavLink from './NavLink'

export default function Nav({ m, location }) {
  return m?.subMenu
    ? m.view && <NavDropdown m={m} location={location} />
    : m.view && <NavLink m={m} location={location} />
}
