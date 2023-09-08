import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import XCircle from '../../icons/XCircle'
import NavLink from './NavLink'

export default function NavDropdown({ m, location }) {
  const isDropDownActive = m.subMenu.map((menu) => menu.path).includes(location.pathname)
  const [dropDowns, setDropDowns] = useState(() => (isDropDownActive ? { [`d${m.id}`]: true } : {}))
  const toggleSideMenu = (e, id) => {
    e.preventDefault()
    setDropDowns({ [id]: !dropDowns[id] })
  }

  return (
    <>
      <li>
        <Link
          to="#"
          onClick={(e) => toggleSideMenu(e, `d${m.id}`)}
          className={`side-menu ${dropDowns?.[`d${m.id}`] ? 'side-menu--open' : ''} ${
            isDropDownActive ? 'side-menu--active' : ''
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
        </Link>
        <ul className={`shadow ${dropDowns?.[`d${m.id}`] ? 'side-menu__sub-open' : ''}`}>
          {m.subMenu.map(
            (subMenu) =>
              subMenu.view && (
                <NavLink key={`${subMenu.label}${subMenu.label}`} m={subMenu} location={location} />
              )
          )}
        </ul>
      </li>
    </>
  )
}
