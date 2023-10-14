import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import Home from '../../icons/Home'
import { mainMenu } from '../../resources/staticData/mainMenu'
import './Menu.scss'
import NavItem from './NavItem'

function Menu({ setMobileMenuClosed }) {
  const location = useLocation()
  const { t } = useTranslation()
  const menu = useMemo(() => mainMenu(t), [t])

  return (
    <>
      <nav className="menu mt-md-5">
        <ul>
          <li>
            <Link
              to="/"
              className={`side-menu ${location.pathname === '/' ? 'side-menu--active' : ''}`}
              onClick={setMobileMenuClosed}>
              <div className="side-menu__icon">
                <Home />
              </div>
              <div className="side-menu__title">{t('menu.dashboard')}</div>
            </Link>
          </li>
          {Object.keys(menu).map((key, i) => (
            <NavItem
              key={i}
              menu={menu}
              menuKey={key}
              location={location}
              setMobileMenuClosed={setMobileMenuClosed}
            />
          ))}
        </ul>
      </nav>
    </>
  )
}

export default memo(Menu)
