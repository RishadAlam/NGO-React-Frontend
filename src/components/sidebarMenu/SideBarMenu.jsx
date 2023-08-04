import './sidebarMenu.scss'

export default function SideBarMenu() {
  return (
    <>
      <nav className="menu">
        <ul>
          <li>
            <a href="" className="side-menu">
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
          </li>
          <div className="side-nav__devider my-2">
            <span>Registration</span>
          </div>
          <li>
            <a href="" className="side-menu side-menu--active side-menu--open">
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
            <ul className="side-menu__sub-open shadow">
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
