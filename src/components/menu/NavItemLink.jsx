import loadable from '@loadable/component'
import React from 'react'
import { NavLink } from 'react-router-dom'
import LoaderSm from '../loaders/LoaderSm'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="#1c3faa" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

export default function NavItemLink({ m, setMobileMenuClosed, iconSize = 22 }) {
  return (
    <>
      <li>
        <NavLink
          to={m.path}
          className={({ isActive }) => `side-menu ${isActive ? 'side-menu--active' : ''}`}
          onClick={setMobileMenuClosed}>
          <div className="side-menu__icon">
            <DynamicIcon icon={m.icon} size={iconSize} />
          </div>
          <div className="side-menu__title">{m.label}</div>
        </NavLink>
      </li>
    </>
  )
}
