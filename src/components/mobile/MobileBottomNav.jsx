import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import useLanguageMode from '../../hooks/useLanguageMode'
import useThemeMode from '../../hooks/useThemeMode'
import Grid from '../../icons/Grid'
import Home from '../../icons/Home'
import Moon from '../../icons/Moon'
import Search from '../../icons/Search'
import Sun from '../../icons/Sun'

export default function MobileBottomNav() {
  const { t } = useTranslation()
  const { language, toggleLanguage } = useLanguageMode()
  const { isDark, toggleThemeMode } = useThemeMode()
  const linkClassName = ({ isActive }) =>
    `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`

  return (
    <nav className="mobile-bottom-nav d-md-none" aria-label={t('mobile.navigation')}>
      <NavLink to="/dashboard" className={linkClassName} aria-label={t('menu.dashboard')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          <Home size={22} />
        </span>
        <span className="mobile-bottom-nav__label">{t('menu.dashboard')}</span>
      </NavLink>
      <NavLink to="/search" className={linkClassName} aria-label={t('common.search')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          <Search size={22} />
        </span>
        <span className="mobile-bottom-nav__label">{t('common.search')}</span>
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
          <Grid size={27} />
        </span>
        <span className="mobile-bottom-nav__label">{t('mobile.all_services')}</span>
      </NavLink>
      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--theme"
        onClick={toggleThemeMode}
        aria-label={t('mobile.theme')}>
        <span className="mobile-bottom-nav__icon" aria-hidden="true">
          {isDark ? <Moon size={22} /> : <Sun size={22} />}
        </span>
        <span className="mobile-bottom-nav__label">{t('mobile.theme')}</span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--language"
        onClick={toggleLanguage}
        aria-label={`${t('mobile.language')}: ${language === 'en' ? 'EN' : 'BN'}`}
        aria-pressed={language === 'bn'}>
        <span className="mobile-bottom-nav__language-toggle" aria-hidden="true">
          <span className={language === 'en' ? 'is-active' : ''}>EN</span>
          <span className={language === 'bn' ? 'is-active' : ''}>BN</span>
        </span>
        <span className="mobile-bottom-nav__label">{t('mobile.language')}</span>
      </button>
    </nav>
  )
}
