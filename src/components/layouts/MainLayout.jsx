import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import { useIsLoadingValue } from '../../atoms/loaderAtoms'
import Menu from '../menu/Menu'
import SideBarLogo from '../sidebarLogo/SideBarLogo'
import TopBar from '../topBar/TopBar'
import './layout.scss'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthorized = useIsAuthorizedValue()
  const isLoading = useIsLoadingValue()
  const [isSidebarMd, setIsSidebarMd] = useState(() => (window.innerWidth <= 1024 ? true : false))
  const { t } = useTranslation()

  useEffect(() => {
    if (!isAuthorized) navigate('login', { state: { from: location }, replace: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized])

  //   if (isLoading) {
  //   return <div>loading...</div>
  // }

  return (
    <>
      {isAuthorized && (
        <section className="main">
          <div className="d-flex">
            <div className={`side-bar d-md-block d-none ${isSidebarMd ? 'side-bar-sm' : ''}`}>
              <SideBarLogo />
              <Menu />
            </div>
            <div className="main-body">
              <TopBar setIsSidebarMd={setIsSidebarMd} />
              <div className={`mobile-menu px-3 d-md-none ${isSidebarMd ? 'active' : ''}`}>
                <Menu />
              </div>
              <div className="content p-2">
                <Outlet />
              </div>
            </div>
          </div>
          <div className="footer">footer</div>
        </section>
      )}
    </>
  )
}
