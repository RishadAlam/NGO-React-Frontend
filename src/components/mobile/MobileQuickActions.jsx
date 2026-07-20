import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mainMenu } from '../../resources/staticData/mainMenu'
import MobileServiceIcon from './MobileServiceIcon'

const mobileQuery = '(max-width: 767.98px)'

export default function MobileQuickActions() {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileQuery).matches)
  const [activeGroupId, setActiveGroupId] = useState(null)
  const activeGroupCloseRef = useRef(null)
  const activeGroupTriggerRef = useRef(null)

  const closeGroupMenu = useCallback(() => {
    setActiveGroupId(null)
    window.requestAnimationFrame(() => activeGroupTriggerRef.current?.focus())
  }, [])

  useEffect(() => {
    const media = window.matchMedia(mobileQuery)
    const updateViewport = (event) => {
      setIsMobile(event.matches)

      if (!event.matches) {
        setActiveGroupId(null)
      }
    }

    media.addEventListener('change', updateViewport)
    return () => media.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    if (!activeGroupId) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeGroupMenu()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    window.requestAnimationFrame(() => activeGroupCloseRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeGroupId, closeGroupMenu])

  const { quickActions, otherActionGroups } = useMemo(() => {
    const serviceIcons = {
      '/registration/client': 'memberRegistration',
      '/registration/saving-account': 'savings',
      '/registration/loan-account': 'loan',
      '/collection/regular/saving': 'regularSavingsCollection',
      '/collection/regular/loan': 'regularLoanCollection',
      '/collection/pending/saving': 'pendingSavingsCollection',
      '/collection/pending/loan': 'pendingLoanCollection',
      '/pending/loans': 'approval',
      '/pending/registration/client': 'memberApproval',
      '/pending/registration/saving-account': 'savings',
      '/pending/registration/loan-account': 'loan',
      '/pending/withdrawal/saving': 'withdrawal',
      '/pending/withdrawal/loan-saving': 'withdrawal',
      '/pending/transactions/saving_to_saving': 'transferHorizontal',
      '/pending/transactions/saving_to_loan': 'transferUp',
      '/pending/transactions/loan_to_saving': 'transferDown',
      '/pending/transactions/loan_to_loan': 'transfer',
      '/pending/delete/saving': 'delete',
      '/pending/delete/loan-saving': 'delete',
      '/fields': 'field',
      '/centers': 'center',
      '/categories': 'category',
      '/registered/client': 'registeredMembers',
      '/registered/saving-account': 'savings',
      '/registered/loan-account': 'loan',
      '/accounts': 'account',
      '/accounts/transactions': 'transaction',
      '/accounts/incomes': 'income',
      '/accounts/expenses': 'expense',
      '/accounts/transfers': 'transfer',
      '/accounts/withdrawals': 'withdrawal',
      '/accounts/incomes/categories': 'list',
      '/accounts/expenses/categories': 'category',
      '/analytics': 'analytics',
      '/staffs': 'staff',
      '/staff-roles': 'staffRoles',
      '/audit-report/meta': 'auditMeta',
      '/audit-report/internal': 'internalAudit',
      '/audit-report': 'audit',
      '/settings-and-privacy': 'settings',
      '/settings-and-privacy/approvals': 'approval',
      '/settings-and-privacy/categories-config': 'categoryConfig',
      '/recycle-bin': 'recycleBin'
    }
    const serviceLabels = {
      '/collection/regular/saving': t('mobile.regular_savings_collection'),
      '/collection/regular/loan': t('mobile.regular_loan_collection'),
      '/collection/pending/saving': t('mobile.pending_savings_collection'),
      '/collection/pending/loan': t('mobile.pending_loan_collection'),
      '/pending/transactions/saving_to_loan': t('analytics.source_types.saving_to_loan'),
      '/pending/transactions/loan_to_saving': t('analytics.source_types.loan_to_saving'),
      '/pending/transactions/loan_to_loan': t('analytics.source_types.loan_to_loan')
    }

    const visibleActions = Object.values(mainMenu(t)).flatMap((sectionItems) =>
      sectionItems.flatMap((item) => {
        if (!item.view) return []

        const actions = item.subMenu?.length
          ? item.subMenu.filter((subItem) => subItem.view && subItem.path)
          : item.path
            ? [item]
            : []

        return actions.map((action) => ({
          ...action,
          label: serviceLabels[action.path] || action.label,
          icon: serviceIcons[action.path] || 'grid'
        }))
      })
    )

    const uniqueRoutes = visibleActions.reduce((actionMap, action) => {
      if (!actionMap.has(action.path)) actionMap.set(action.path, action)

      return actionMap
    }, new Map())
    const routeActions = Array.from(uniqueRoutes.values())
    const quickPriorityMatchers = [
      (path) => path.startsWith('/registration/'),
      (path) => path.startsWith('/collection/regular/'),
      (path) => path.startsWith('/collection/pending/'),
      (path) => path === '/analytics',
      (path) => path === '/recycle-bin'
    ]
    const quickActions = quickPriorityMatchers.flatMap((matchesPath) =>
      routeActions.filter((action) => matchesPath(action.path))
    )
    const quickPaths = new Set(quickActions.map((action) => action.path))
    let remainingActions = routeActions.filter((action) => !quickPaths.has(action.path))

    const otherGroupDefinitions = [
      {
        id: 'approvals',
        label: t('menu.categories.Pending_Approval'),
        icon: 'approvals',
        matchesPath: (path) => path.startsWith('/pending/')
      },
      {
        id: 'registered-accounts',
        label: t('menu.label.registered_account_list'),
        icon: 'registeredAccounts',
        matchesPath: (path) => path.startsWith('/registered/')
      },
      {
        id: 'setup',
        label: t('menu.categories.Control_Panel'),
        icon: 'setup',
        matchesPath: (path) => ['/fields', '/centers', '/categories'].includes(path)
      },
      {
        id: 'financial-management',
        label: t('menu.label.account_management'),
        icon: 'finance',
        matchesPath: (path) => path === '/accounts' || path.startsWith('/accounts/')
      },
      {
        id: 'team-management',
        label: t('menu.label.staff'),
        icon: 'team',
        matchesPath: (path) => path === '/staffs' || path.startsWith('/staff-')
      },
      {
        id: 'audit-reports',
        label: t('menu.label.audit'),
        icon: 'audit',
        matchesPath: (path) => path.startsWith('/audit-report')
      },
      {
        id: 'system-settings',
        label: t('menu.label.settings_and_privacy'),
        icon: 'settings',
        matchesPath: (path) => path.startsWith('/settings-and-privacy')
      }
    ]

    const otherActionGroups = otherGroupDefinitions.flatMap((group) => {
      const actions = remainingActions.filter((action) => group.matchesPath(action.path))
      remainingActions = remainingActions.filter((action) => !group.matchesPath(action.path))

      return actions.length > 0
        ? [{ ...group, sectionLabel: t('mobile.other_services'), actions }]
        : []
    })

    if (remainingActions.length > 0) {
      otherActionGroups.push({
        id: 'more-services',
        label: t('mobile.more_services'),
        icon: 'grid',
        sectionLabel: t('mobile.other_services'),
        actions: remainingActions
      })
    }

    return { quickActions, otherActionGroups }
  }, [t])

  const otherActionCount = otherActionGroups.reduce(
    (actionCount, group) => actionCount + group.actions.length,
    0
  )
  const activeGroup = otherActionGroups.find((group) => group.id === activeGroupId)

  if (!isMobile || quickActions.length + otherActionCount === 0) return null

  const renderAction = (action, onSelect) => (
    <Link
      to={action.path}
      className="mobile-quick-actions__item"
      key={action.path}
      onClick={onSelect}>
      <span className="mobile-quick-actions__icon" aria-hidden="true">
        <MobileServiceIcon name={action.icon} />
      </span>
      <span className="mobile-quick-actions__label">{action.label}</span>
    </Link>
  )

  const renderService = (group) => {
    if (group.actions.length === 1) return renderAction(group.actions[0])

    return (
      <button
        type="button"
        className="mobile-quick-actions__item mobile-quick-actions__group-trigger"
        aria-haspopup="dialog"
        aria-controls="mobile-action-group-sheet"
        onClick={(event) => {
          activeGroupTriggerRef.current = event.currentTarget
          setActiveGroupId(group.id)
        }}
        key={group.id}>
        <span className="mobile-quick-actions__icon" aria-hidden="true">
          <MobileServiceIcon name={group.icon} />
        </span>
        <span className="mobile-quick-actions__label">{group.label}</span>
      </button>
    )
  }

  return (
    <section className="mobile-quick-actions" aria-labelledby="mobile-quick-actions-title">
      <div className="mobile-quick-actions__primary">
        <h2 id="mobile-quick-actions-title">{t('mobile.quick_actions')}</h2>
        <div className="mobile-quick-actions__grid">{quickActions.map(renderAction)}</div>
      </div>

      {otherActionCount > 0 && (
        <div id="mobile-other-services" className="mobile-quick-actions__secondary">
          <h3>{t('mobile.other_services')}</h3>
          <div className="mobile-quick-actions__group-grid">
            {otherActionGroups.map(renderService)}
          </div>
        </div>
      )}

      {activeGroup &&
        createPortal(
          <div className="mobile-action-sheet">
            <button
              type="button"
              className="mobile-action-sheet__backdrop"
              onClick={closeGroupMenu}
              aria-label={t('mobile.close_menu')}
            />
            <section
              id="mobile-action-group-sheet"
              className="mobile-action-sheet__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-action-group-sheet-title">
              <div className="mobile-action-sheet__handle" aria-hidden="true" />
              <div className="mobile-action-sheet__header">
                <div>
                  <small>{activeGroup.sectionLabel}</small>
                  <h3 id="mobile-action-group-sheet-title">{activeGroup.label}</h3>
                </div>
                <button
                  type="button"
                  ref={activeGroupCloseRef}
                  onClick={closeGroupMenu}
                  aria-label={t('mobile.close_menu')}>
                  <MobileServiceIcon name="close" size={22} />
                </button>
              </div>
              <div className="mobile-action-sheet__grid">
                {activeGroup.actions.map((action) =>
                  renderAction(action, () => setActiveGroupId(null))
                )}
              </div>
            </section>
          </div>,
          document.body
        )}
    </section>
  )
}
