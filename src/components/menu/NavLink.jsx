import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import LoaderSm from '../loaders/LoaderSm'

export default function NavLink({ m, location, setMobileMenuClosed }) {
  const DynamicIcon = lazy(() => import(`../../icons/${m.icon}`))

  return (
    <>
      <li>
        <Link
          to={m.path}
          className={`side-menu ${location.pathname === m.path ? 'side-menu--active' : ''}`}
          onClick={setMobileMenuClosed}>
          <div className="side-menu__icon">
            <Suspense fallback={<LoaderSm size={20} clr="#1c3faa" className="ms-2" />}>
              <DynamicIcon size={18} />
            </Suspense>
          </div>
          <div className="side-menu__title">{m.label}</div>
        </Link>
      </li>
    </>
  )
}
