import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { mainMenu } from '../../resources/staticData/mainMenu'
import ChevronLeft from '../../icons/ChevronLeft'
import Grid from '../../icons/Grid'

const flattenMenu = (items, parentLabel = '') =>
  items.flatMap((item) => {
    const currentItem = item.path ? [{ label: item.label, parentLabel, path: item.path }] : []
    const childItems = item.subMenu?.length
      ? flattenMenu(item.subMenu, item.label || parentLabel)
      : []

    return [...currentItem, ...childItems]
  })

const humanizePath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean)
  const usefulSegment = [...segments].reverse().find((segment) => !/^\d+$/.test(segment)) || ''

  return usefulSegment
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export default function MobilePageHeader({ onMenuOpen }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = ['/', '/dashboard'].includes(location.pathname)
  const isServicesPage = location.pathname === '/services'

  const page = useMemo(() => {
    if (isDashboard) return { label: t('menu.dashboard'), parentLabel: '' }
    if (location.pathname === '/search') return { label: t('common.search'), parentLabel: '' }
    if (location.pathname === '/profile') {
      return { label: t('profile_box.profile'), parentLabel: '' }
    }
    if (location.pathname === '/change-password') {
      return { label: t('profile_box.change_password'), parentLabel: '' }
    }

    const menuItems = Object.values(mainMenu(t)).flatMap((items) => flattenMenu(items))
    const matchedItem = menuItems
      .filter(
        (item) =>
          item.path === location.pathname ||
          (item.path !== '/' && location.pathname.startsWith(`${item.path}/`))
      )
      .sort((first, second) => second.path.length - first.path.length)[0]

    return (
      matchedItem || {
        label: humanizePath(location.pathname),
        parentLabel: ''
      }
    )
  }, [isDashboard, location.pathname, t])

  if (isDashboard || isServicesPage) return null

  return (
    <header className="mobile-page-header d-md-none">
      <button
        type="button"
        className={`mobile-page-header__action ${isDashboard ? 'is-placeholder' : ''}`}
        onClick={() => navigate(-1)}
        aria-label={t('mobile.back')}
        aria-hidden={isDashboard}
        tabIndex={isDashboard ? -1 : 0}>
        <ChevronLeft size={22} />
      </button>
      <div className="mobile-page-header__title">
        <h1>{page.label}</h1>
        {page.parentLabel ? <span>{page.parentLabel}</span> : null}
      </div>
      <button
        type="button"
        className="mobile-page-header__action"
        onClick={onMenuOpen}
        aria-label={t('mobile.open_menu')}
        aria-controls="mobile-navigation-sheet">
        <Grid size={21} />
      </button>
    </header>
  )
}
