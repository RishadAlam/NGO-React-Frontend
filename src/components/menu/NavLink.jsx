import React from 'react'
import { Link } from 'react-router-dom'

export default function NavLink({ m, location, setMobileMenuClosed }) {
  return (
    <>
      <li>
        <Link
          to={m.path}
          className={`side-menu ${location.pathname === m.path ? 'side-menu--active' : ''}`}
          onClick={setMobileMenuClosed}>
          <div className="side-menu__icon">
            {' '}
            <i data-feather="activity"></i>{' '}
          </div>
          <div className="side-menu__title">{m.label}</div>
        </Link>
      </li>
    </>
  )
}
