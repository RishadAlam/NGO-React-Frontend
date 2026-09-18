import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { mainMenu } from '../../resources/staticData/mainMenu'
import ChevronLeft from '../../icons/ChevronLeft'
import Grid from '../../icons/Grid'

// These pages are not menu destinations. Keep their existing breadcrumb/card
// names when the phone header replaces those breadcrumbs.
const detailPageTitles = [
  ['/client-register/:id', 'common.client_register'],
  ['/saving-account/:id', 'common.saving_account'],
  ['/loan-account/:id', 'common.loan_account'],
  ['/staff-permissions/:id', 'menu.staffs.Staff_Permissions'],
  ['/role-permissions/:id', 'menu.staffs.Role_Permissions'],
  ['/dashboard/loan-given', 'dashboard.cards.Loan_Given'],
  ['/dashboard/loan-recovered', 'dashboard.cards.Loan_Recovered'],
  ['/dashboard/loan-saving', 'dashboard.cards.Loan_Saving_Collections'],
  ['/dashboard/monthly-loan', 'dashboard.cards.Monthly_Loan_Collections'],
  ['/dashboard/saving-collections', 'dashboard.cards.Saving_Collections'],
  ['/dashboard/dps-collections', 'dashboard.cards.DPS_Collections']
]

// The two workflows share child-menu names. Use the existing complete mobile
// titles so collectors keep their regular/pending context at every drill-down.
const collectionPageTitles = [
  ['/collection/regular/saving', 'mobile.regular_savings_collection'],
  ['/collection/regular/loan', 'mobile.regular_loan_collection'],
  ['/collection/pending/saving', 'mobile.pending_savings_collection'],
  ['/collection/pending/loan', 'mobile.pending_loan_collection']
]

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
  const entryKey = useRef(location.key)
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

    const detailPage = detailPageTitles.find(([path]) => matchPath(path, location.pathname))
    if (detailPage) return { label: t(detailPage[1]), parentLabel: '' }

    const collectionPage = collectionPageTitles.find(([path]) =>
      matchPath({ path, end: false }, location.pathname)
    )
    if (collectionPage) return { label: t(collectionPage[1]), parentLabel: '' }

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

  const goBack = () => {
    // Browser history.length also counts other websites. React Router's index
    // only counts entries since this app's router initialized. Routers without
    // a browser index can still return from a route reached inside this shell.
    const historyIndex = window.history.state?.idx
    const hasPreviousAppEntry =
      typeof historyIndex === 'number' ? historyIndex > 0 : location.key !== entryKey.current
    if (hasPreviousAppEntry) navigate(-1)
    else navigate('/services', { replace: true })
  }

  return (
    <header className="mobile-page-header d-md-none">
      <button
        type="button"
        className={`mobile-page-header__action ${isDashboard ? 'is-placeholder' : ''}`}
        onClick={goBack}
        aria-label={t('mobile.back')}
        aria-hidden={isDashboard}
        tabIndex={isDashboard ? -1 : 0}>
        <ChevronLeft size={22} />
      </button>
      <div className="mobile-page-header__title">
        <h1>{page.label}</h1>
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
