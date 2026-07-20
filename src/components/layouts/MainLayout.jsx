import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import XCircle from '../../icons/XCircle'
import ErrorFallback from '../_helper/errorFallback/ErrorFallback'
import Loader from '../loaders/Loader'
import Menu from '../menu/Menu'
import MobileBottomNav from '../mobile/MobileBottomNav'
import MobilePageHeader from '../mobile/MobilePageHeader'
import SideBarLogo from '../sidebarLogo/SideBarLogo'
import TopBar from '../topBar/TopBar'
import './layout.scss'

const MobileServices = lazy(() => import('../../pages/mobileServices/MobileServices'))

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const isAuthorized = useIsAuthorizedValue()
  const [isSidebarMd, setIsSidebarMd] = useState(() => (window.innerWidth <= 1024 ? true : false))
  const [disableMenuScroll, setDisableMenuScroll] = useState(false)
  const isServicesPage = location.pathname === '/services'
  const [hasVisitedServices, setHasVisitedServices] = useState(isServicesPage)
  const contentRef = useRef(null)
  const servicesScrollPositionRef = useRef(0)

  useEffect(() => {
    if (!isAuthorized) navigate('login', { state: { from: location }, replace: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const updateMenuScrollState = () => {
      setDisableMenuScroll(content.scrollHeight > window.innerHeight)
    }

    updateMenuScrollState()
    window.addEventListener('resize', updateMenuScrollState)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', updateMenuScrollState)
      }
    }

    const resizeObserver = new ResizeObserver(updateMenuScrollState)
    resizeObserver.observe(content)

    return () => {
      window.removeEventListener('resize', updateMenuScrollState)
      resizeObserver.disconnect()
    }
  }, [location.pathname])

  useEffect(() => {
    if (isServicesPage) setHasVisitedServices(true)
  }, [isServicesPage])

  useEffect(() => {
    if (window.innerWidth >= 768 || !isServicesPage) return undefined

    const rememberServicesScroll = () => {
      servicesScrollPositionRef.current = window.scrollY
    }

    rememberServicesScroll()
    window.addEventListener('scroll', rememberServicesScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', rememberServicesScroll)
    }
  }, [isServicesPage])

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarMd(true)
      const scrollFrame = window.requestAnimationFrame(() => {
        window.scrollTo({
          top: isServicesPage ? servicesScrollPositionRef.current : 0,
          left: 0,
          behavior: 'auto'
        })
      })

      return () => window.cancelAnimationFrame(scrollFrame)
    }

    return undefined
  }, [isServicesPage, location.pathname])

  useEffect(() => {
    if (window.innerWidth >= 768 || isSidebarMd) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isSidebarMd])

  const setMobileMenuClosed = () => {
    if (window.innerWidth < 768) {
      setIsSidebarMd(true)
    }
  }

  return (
    <>
      {isAuthorized && (
        <section className="main">
          <div className="d-flex">
            <div className={`side-bar d-md-block d-none ${isSidebarMd ? 'side-bar-sm' : ''}`}>
              <SideBarLogo />
              <Menu setMobileMenuClosed={setMobileMenuClosed} disableScroll={disableMenuScroll} />
            </div>
            <div
              className={`main-body ${isServicesPage ? 'main-body--services' : ''}`}>
              <TopBar setIsSidebarMd={setIsSidebarMd} isSidebarMd={isSidebarMd} />
              <div
                className={`mobile-menu d-md-none ${isSidebarMd ? '' : 'active'}`}
                aria-hidden={isSidebarMd}>
                <button
                  type="button"
                  className="mobile-menu__backdrop"
                  onClick={() => setIsSidebarMd(true)}
                  aria-label={t('mobile.close_menu')}
                  tabIndex={isSidebarMd ? -1 : 0}
                />
                <aside
                  id="mobile-navigation-sheet"
                  className="mobile-menu__sheet"
                  aria-label={t('mobile.all_services')}
                  inert={isSidebarMd ? '' : undefined}>
                  <div className="mobile-menu__handle" aria-hidden="true" />
                  <div className="mobile-menu__header">
                    <strong>{t('mobile.all_services')}</strong>
                    <button
                      type="button"
                      onClick={() => setIsSidebarMd(true)}
                      aria-label={t('mobile.close_menu')}>
                      <XCircle size={22} />
                    </button>
                  </div>
                  <Menu
                    setMobileMenuClosed={setMobileMenuClosed}
                    disableScroll={disableMenuScroll}
                    dashboardPath="/dashboard"
                  />
                </aside>
              </div>
              <div
                className={`content mobile-page-grid p-2 ${
                  isServicesPage ? 'content--services-mobile' : ''
                }`}
                ref={contentRef}>
                <MobilePageHeader onMenuOpen={() => setIsSidebarMd(false)} />
                {(hasVisitedServices || isServicesPage) && (
                  <div
                    className="mobile-services-cache d-md-none"
                    hidden={!isServicesPage}
                    aria-hidden={!isServicesPage}>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense
                        fallback={
                          <Loader
                            className="mobile-services-loader"
                            style={{ height: 'min(45dvh, 360px)' }}
                          />
                        }>
                        <MobileServices isActive={isServicesPage} />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                )}
                {!isServicesPage && <Outlet />}
              </div>
            </div>
          </div>
          <MobileBottomNav />
          <div className="footer">
            <p>v 1.0.0</p>
            <p>
              <small>Developed By</small> RISHAD ALAM
            </p>
          </div>
        </section>
      )}
    </>
  )
}
