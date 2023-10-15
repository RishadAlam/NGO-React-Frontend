import loadable from '@loadable/component'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import LoaderSm from '../loaders/LoaderSm'
import NavItemLink from './NavItemLink'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="#1c3faa" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

export default function NavDropdown({ m, setMobileMenuClosed }) {
  const location = useLocation()
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
            <DynamicIcon icon={m.icon} />
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
                <NavItemLink
                  key={`${subMenu.label}${subMenu.label}`}
                  m={subMenu}
                  setMobileMenuClosed={setMobileMenuClosed}
                  iconSize={18}
                />
              )
          )}
        </ul>
      </li>
    </>
  )
}
