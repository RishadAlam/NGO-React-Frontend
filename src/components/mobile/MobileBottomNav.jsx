import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import useLanguageMode from '../../hooks/useLanguageMode'
import useThemeMode from '../../hooks/useThemeMode'
import Grid from '../../icons/Grid'
import Home from '../../icons/Home'
import Moon from '../../icons/Moon'
import Search from '../../icons/Search'
import Sun from '../../icons/Sun'
import ProfileBox from '../profileBox/ProfileBox'

export default function MobileBottomNav() {
  const { t } = useTranslation()
  const { language, toggleLanguage } = useLanguageMode()
  const { isDark, toggleThemeMode } = useThemeMode()
  const isMobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const linkClassName = ({ isActive }) =>
    `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`

  return (
    <nav className="mobile-bottom-nav d-md-none" aria-label={t('mobile.navigation')}>
      <NavLink to="/dashboard" className={linkClassName} aria-label={t('menu.dashboard')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          <Home size={22} />
        </span>
      </NavLink>
      <NavLink to="/search" className={linkClassName} aria-label={t('common.search')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          <Search size={22} />
        </span>
      </NavLink>
      <NavLink
        to="/services"
        className={({ isActive }) =>
          `mobile-bottom-nav__item mobile-bottom-nav__item--services ${
            isActive ? 'mobile-bottom-nav__item--active' : ''
          }`
        }
        aria-label={t('mobile.all_services')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          <Grid size={22} />
        </span>
      </NavLink>
      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--theme"
        onClick={toggleThemeMode}
        aria-pressed={isDark}
        aria-label={t('mobile.theme')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          {isDark ? <Moon size={22} /> : <Sun size={22} />}
        </span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--language"
        onClick={toggleLanguage}
        aria-label={`${t('mobile.language')}: ${t(language === 'en' ? 'localization.shared.english_short' : 'localization.shared.bengali_short')}`}
        aria-pressed={language === 'bn'}>
        <span className="mobile-bottom-nav__language-toggle" aria-hidden="true">
          <span className={language === 'en' ? 'is-active' : ''}>
            {t('localization.shared.english_badge')}
          </span>
          <span className={language === 'bn' ? 'is-active' : ''}>
            {t('localization.shared.bengali_badge')}
          </span>
        </span>
      </button>
      {isMobile && <ProfileBox t={t} variant="dock" />}
    </nav>
  )
}
