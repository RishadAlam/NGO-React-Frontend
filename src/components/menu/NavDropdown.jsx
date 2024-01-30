import loadable from '@loadable/component'
import { Link } from 'react-router-dom'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import LoaderSm from '../loaders/LoaderSm'
import NavItemLink from './NavItemLink'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="#1c3faa" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

export default function NavDropdown({
  m,
  setMobileMenuClosed,
  dropDowns,
  isDropDownActive,
  toggleSideMenu,
  menuKey
}) {
  return (
    <>
      <li>
        <Link
          to="#"
          onClick={(e) => toggleSideMenu(e, `${menuKey}d${m.id}`)}
          className={`side-menu ${dropDowns?.[`${menuKey}d${m.id}`] ? 'side-menu--open' : ''} ${
            isDropDownActive ? 'side-menu--active' : ''
          } cursor-pointer`}>
          <div className="side-menu__icon">
            <DynamicIcon icon={m.icon} />
          </div>

          <div className="side-menu__title">
            {m.label}
            <div className="side-menu__sub-icon">
              {dropDowns?.[`${menuKey}d${m.id}`] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </div>
          </div>
        </Link>
        <ul
          className={`shadow mt-1 ${
            dropDowns?.[`${menuKey}d${m.id}`] ? 'side-menu__sub-open' : ''
          }`}>
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
