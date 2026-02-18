import loadable from '@loadable/component'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import LoaderSm from '../loaders/LoaderSm'
import NavItemLink from './NavItemLink'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="currentColor" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

export default function NavDropdown({
  m,
  setMobileMenuClosed,
  dropDowns,
  isDropDownActive,
  toggleSideMenu,
  dropdownId,
  subMenuItems
}) {
  const isOpen = dropDowns?.[dropdownId]

  return (
    <>
      <li>
        <button
          type="button"
          onClick={(e) => toggleSideMenu(e, dropdownId)}
          className={`side-menu side-menu--trigger ${isOpen ? 'side-menu--open' : ''} ${
            isDropDownActive ? 'side-menu--active' : ''
          } cursor-pointer`}
          aria-expanded={Boolean(isOpen)}
          aria-controls={`submenu-${dropdownId}`}
          aria-label={m.label}
          title={m.label}>
          <div className="side-menu__icon">
            <DynamicIcon icon={m.icon} stroke="currentColor" color="currentColor" />
          </div>

          <div className="side-menu__title">
            <span className="side-menu__text">{m.label}</span>
            <div className="side-menu__sub-icon">
              {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
          </div>
        </button>
        <ul
          id={`submenu-${dropdownId}`}
          className={`side-menu__submenu ${isOpen ? 'side-menu__sub-open' : ''}`}>
          {subMenuItems.map((subMenu) => (
            <NavItemLink
              key={subMenu.id || subMenu.path || subMenu.label}
              m={subMenu}
              setMobileMenuClosed={setMobileMenuClosed}
              iconSize={18}
              isSubMenu
            />
          ))}
        </ul>
      </li>
    </>
  )
}
