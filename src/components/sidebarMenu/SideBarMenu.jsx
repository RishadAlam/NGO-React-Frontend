import { useLocation } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Home from '../../icons/Home'
import { menu } from '../../resources/staticData/menu'
import NavItem from './NavItem'
import './sidebarMenu.scss'

export default function SideBarMenu() {
  const authData = useAuthDataValue()
  const location = useLocation()

  return (
    <>
      <nav className="menu mt-5">
        <ul>
          <li>
            <a
              href=""
              className={`side-menu ${location.pathname === '/' ? 'side-menu--active' : ''}`}>
              <div className="side-menu__icon">
                <Home />
              </div>
              <div className="side-menu__title">Dashboard</div>
            </a>
          </li>
          {Object.keys(menu).map((key, i) => (
            <NavItem
              key={i}
              menu={menu}
              menuKey={key}
              location={location}
              userPermissions={authData.permissions}
            />
          ))}
        </ul>
      </nav>
    </>
  )
}
