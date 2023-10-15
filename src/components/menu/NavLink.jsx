import loadable from "@loadable/component";
import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoaderSm from '../loaders/LoaderSm';

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="#1c3faa" className="ms-2" />,
  cacheKey: ({ icon }) => icon
})

function NavLink({ m, setMobileMenuClosed, iconSize = 22 }) {
  const location = useLocation()

  return (
    <>
      <li>
        <Link
          to={m.path}
          className={`side-menu ${location.pathname === m.path ? 'side-menu--active' : ''}`}
          onClick={setMobileMenuClosed}>
          <div className="side-menu__icon">
            <DynamicIcon icon={m.icon} size={iconSize} />
          </div>
          <div className="side-menu__title">{m.label}</div>
        </Link>
      </li>
    </>
  )
}

export default memo(NavLink)
