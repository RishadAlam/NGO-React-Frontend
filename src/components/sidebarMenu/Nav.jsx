import checkPermission from '../../helper/checkPermission'
import NavDropdown from './NavDropdown'
import NavLink from './NavLink'

export default function Nav({ m, location, userPermissions }) {
  return m?.subMenu
    ? checkPermission(m.permissions, userPermissions) && (
        <NavDropdown m={m} location={location} userPermissions={userPermissions} />
      )
    : checkPermission(m.permissions, userPermissions) && <NavLink m={m} location={location} />
}
