import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import Home from '../../icons/Home'
import { mainMenu } from '../../resources/staticData/mainMenu'
import './Menu.scss'
import NavItem from './NavItem'
import { useAuthDataValue } from '../../atoms/authAtoms'

const NO_PERMISSIONS = []

function Menu({ setMobileMenuClosed, disableScroll = false, dashboardPath = '/', mobile = false }) {
  const { t } = useTranslation()
  const { permissions } = useAuthDataValue()
  const mobilePermissions = mobile ? permissions || NO_PERMISSIONS : undefined
  const menu = useMemo(() => mainMenu(t, { mobilePermissions }), [t, mobilePermissions])
  const sections = useMemo(
    () =>
      Object.entries(menu)
        .map(([sectionLabel, sectionItems], sectionIndex) => ({
          sectionId: `${mobile ? 'mobile-' : ''}section-${sectionIndex}`,
          sectionLabel,
          sectionItems: sectionItems.filter((item) => item.view)
        }))
        .filter((section) => section.sectionItems.length > 0),
    [menu, mobile]
  )
  const [dropDowns, setDropDowns] = useState({})

  const toggleSideMenu = (e, id) => {
    e.preventDefault()
    setDropDowns((prevDropDowns) => (prevDropDowns[id] ? {} : { [id]: true }))
  }

  return (
    <nav
      className={`menu menu--modern mt-md-4 ${disableScroll ? 'menu--full-height' : ''}`}
      aria-label={t('menu.dashboard')}>
      <ul>
        <li>
          <NavLink
            end
            to={dashboardPath}
            className={({ isActive }) => `side-menu ${isActive ? 'side-menu--active' : ''}`}
            onClick={setMobileMenuClosed}
            aria-label={t('menu.dashboard')}
            title={t('menu.dashboard')}>
            <div className="side-menu__icon">
              <Home />
            </div>
            <div className="side-menu__title">
              <span className="side-menu__text">{t('menu.dashboard')}</span>
            </div>
          </NavLink>
        </li>
        {sections.map((section) => (
          <NavItem
            key={section.sectionId}
            sectionId={section.sectionId}
            sectionLabel={section.sectionLabel}
            sectionItems={section.sectionItems}
            setMobileMenuClosed={setMobileMenuClosed}
            dropDowns={dropDowns}
            setDropDowns={setDropDowns}
            toggleSideMenu={toggleSideMenu}
          />
        ))}
      </ul>
    </nav>
  )
}

export default memo(Menu)
