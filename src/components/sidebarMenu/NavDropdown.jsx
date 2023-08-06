import { useState } from 'react'
import checkPermission from '../../helper/checkPermission'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import XCircle from '../../icons/XCircle'
import NavLink from './NavLink'

export default function NavDropdown({ m, location, userPermissions }) {
  const [dropDowns, setDropDowns] = useState({})
  const toggleSideMenu = (id) => setDropDowns({ [id]: !dropDowns[id] })

  return (
    <>
      <li>
        <a
          onClick={() => toggleSideMenu(`d${m.id}`)}
          className={`side-menu ${
            dropDowns?.[`d${m.id}`] ? 'side-menu--open' : ''
          } cursor-pointer`}>
          <div className="side-menu__icon">
            <XCircle />
          </div>
          <div className="side-menu__title">
            {m.label}
            <div className="side-menu__sub-icon">
              {dropDowns?.[`d${m.id}`] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
          </div>
        </a>
        <ul className={`shadow ${dropDowns?.[`d${m.id}`] ? 'side-menu__sub-open' : ''}`}>
          {m.subMenu.map(
            (subMenu) =>
              checkPermission(subMenu.permissions, userPermissions) && (
                <NavLink key={`${subMenu.label}${subMenu.label}`} m={subMenu} location={location} />
              )
          )}
        </ul>
      </li>
    </>
  )
}
