import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import Home from '../../icons/Home'
import XCircle from '../../icons/XCircle'
import './sidebarMenu.scss'

export default function SideBarMenu() {
  const location = useLocation()
  const [dropDowns, setDropDowns] = useState({})
  const toggleSideMenu = (id) => setDropDowns({ ...dropDowns, [id]: !dropDowns[id] })

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
          <div className="side-nav__devider my-2">
            <span>Registration</span>
          </div>
          <li>
            <a
              onClick={() => toggleSideMenu('d1')}
              className={`side-menu ${dropDowns?.d1 ? 'side-menu--open' : ''} cursor-pointer`}>
              <div className="side-menu__icon">
                <XCircle />
              </div>
              <div className="side-menu__title">
                Registration
                <div className="side-menu__sub-icon">
                  {dropDowns?.d1 ? <ChevronDown /> : <ChevronUp />}
                </div>
              </div>
            </a>
            <ul className={`shadow ${dropDowns?.d1 ? 'side-menu__sub-open' : ''}`}>
              <li>
                <a href="index.html" className="side-menu side-menu--active">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 1 </div>
                </a>
              </li>
              <li>
                <a href="side-menu-light-dashboard-overview-2.html" className="side-menu">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 2 </div>
                </a>
              </li>
              <li>
                <a href="side-menu-light-dashboard-overview-3.html" className="side-menu">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 3 </div>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="" className="side-menu side-menu--active">
              <div className="side-menu__icon">
                {' '}
                <i data-feather="home"></i>{' '}
              </div>
              <div className="side-menu__title">
                Dashboard
                <div className="side-menu__sub-icon">
                  {' '}
                  <i data-feather="chevron-down"></i>{' '}
                </div>
              </div>
            </a>
            <ul className="shadow">
              <li>
                <a href="index.html" className="side-menu side-menu--active side-menu--open">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 1 </div>
                </a>
              </li>
              <li>
                <a href="side-menu-light-dashboard-overview-2.html" className="side-menu">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 2 </div>
                </a>
              </li>
              <li>
                <a href="side-menu-light-dashboard-overview-3.html" className="side-menu">
                  <div className="side-menu__icon">
                    {' '}
                    <i data-feather="activity"></i>{' '}
                  </div>
                  <div className="side-menu__title"> Overview 3 </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  )
}
