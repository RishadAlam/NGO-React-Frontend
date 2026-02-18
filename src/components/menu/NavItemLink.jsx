import loadable from '@loadable/component'
import React from 'react'
import { NavLink } from 'react-router-dom'
import LoaderSm from '../loaders/LoaderSm'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="currentColor" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

export default function NavItemLink({ m, setMobileMenuClosed, iconSize = 22, isSubMenu = false }) {
  return (
    <>
      <li>
        <NavLink
          end
          to={m.path}
          className={({ isActive }) =>
            `side-menu ${isSubMenu ? 'side-menu--child' : ''} ${isActive ? 'side-menu--active' : ''}`
          }
          onClick={setMobileMenuClosed}
          aria-label={m.label}
          title={m.label}>
          <div className="side-menu__icon">
            <DynamicIcon icon={m.icon} size={iconSize} stroke="currentColor" color="currentColor" />
          </div>
          <div className="side-menu__title">
            <span className="side-menu__text">{m.label}</span>
          </div>
        </NavLink>
      </li>
    </>
  )
}
