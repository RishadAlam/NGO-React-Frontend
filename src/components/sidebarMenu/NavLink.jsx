import React from 'react'

export default function NavLink({ m, location }) {
  return (
    <>
      <li>
        <a
          href={m.path}
          className={`side-menu ${location.pathname === '/abcd' ? 'side-menu--active' : ''}`}>
          <div className="side-menu__icon">
            {' '}
            <i data-feather="activity"></i>{' '}
          </div>
          <div className="side-menu__title">{m.label}</div>
        </a>
      </li>
    </>
  )
}
