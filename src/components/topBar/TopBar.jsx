import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Menu from '../../icons/Menu'
import DarkLangButton from '../darkLangButton/DarkLangButton'
import ProfileBox from '../profileBox/ProfileBox'
import MainSearchBox from '../searchBox/MainSearchBox'
import './topBar.scss'

function TopBar({ setIsSidebarMd, isSidebarMd }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { company_name = '' } = useAppSettingsValue()
  const { name = '' } = useAuthDataValue()
  const hasCompactMobileHeader = ['/', '/dashboard', '/services'].includes(location.pathname)

  return (
    <>
      <div
        className={`top-bar d-flex align-items-center gap-3 ${
          hasCompactMobileHeader ? 'top-bar--compact-mobile' : ''
        }`}>
        <div
          className="cursor-pointer menu-btn"
          onClick={() => setIsSidebarMd((prevState) => !prevState)}
          role="button"
          tabIndex={0}
          aria-expanded={!isSidebarMd}
          aria-controls="mobile-navigation-sheet"
          aria-label={t('mobile.menu')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setIsSidebarMd((prevState) => !prevState)
            }
          }}>
          <Menu />
        </div>
        <div className="mobile-topbar-identity d-md-none">
          <strong>{name || t('menu.dashboard')}</strong>
          <span>{company_name || t('app_config.app_name')}</span>
        </div>
        <div className="top-bar-search">
          <MainSearchBox t={t} />
        </div>
        <div className="top-bar-actions ms-auto d-flex align-items-center">
          <DarkLangButton />
          <ProfileBox t={t} />
        </div>
      </div>
    </>
  )
}

export default memo(TopBar)
