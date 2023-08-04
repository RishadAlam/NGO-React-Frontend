import { useEffect } from 'react'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import { useIsLoadingValue } from '../../atoms/loaderAtoms'
import SideBarLogo from '../sidebarLogo/SideBarLogo'
import SideBarMenu from '../sidebarMenu/SideBarMenu'
import './layout.scss'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAutorized = useIsAuthorizedValue()
  const isLoading = useIsLoadingValue()

  useEffect(() => {
    if (!isAutorized) navigate('login', { state: { from: location }, replace: false })
  }, [isAutorized])

  //   if (isLoading) {
  //   return <div>loading...</div>
  // }

  return (
    <>
      {isAutorized && (
        <section className="main">
          <div className="d-flex">
            <div className="side-bar d-md-block d-none">
              <SideBarLogo />
              <SideBarMenu />
            </div>
            <div className="main-body">
              <div className="top-bar">TopBar</div>
              <div className="content">content</div>
            </div>
          </div>
          <div className="footer">footer</div>
        </section>
      )}
    </>
  )
}
