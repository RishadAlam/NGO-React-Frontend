import loadable from '@loadable/component'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import XCircle from '../../icons/XCircle'
import { mainMenu } from '../../resources/staticData/mainMenu'
import LoaderSm from '../loaders/LoaderSm'

const DynamicIcon = loadable(({ icon }) => import(`../../icons/${icon}.jsx`), {
  fallback: <LoaderSm size={20} clr="currentColor" />,
  cacheKey: ({ icon }) => icon
})

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
    const actionOverrides = {
      '/pending/loans': { icon: 'CheckPatch' },
      '/pending/registration/client': {
        label: t('mobile.member_approval'),
        icon: 'UserCheck'
      },
      '/pending/registration/saving-account': {
        label: t('mobile.savings_account_approval'),
        icon: 'BankTransferIn'
      },
      '/pending/registration/loan-account': {
        label: t('mobile.loan_account_approval'),
        icon: 'BankTransferOut'
      },
      '/collection/pending/saving': {
        label: t('mobile.pending_savings_collection'),
        icon: 'SaveEnergy'
      },
      '/collection/pending/loan': {
        label: t('mobile.pending_loan_collection'),
        icon: 'Loan'
      },
      '/pending/withdrawal/loan-saving': { icon: 'CashWithdrawal' },
      '/registered/client': {
        label: t('mobile.registered_members'),
        icon: 'Users'
      },
      '/registered/saving-account': {
        label: t('mobile.registered_savings_accounts'),
        icon: 'BankTransferIn'
      },
      '/registered/loan-account': {
        label: t('mobile.registered_loan_accounts'),
        icon: 'BankTransferOut'
      }
    }

    const visibleActions = Object.values(mainMenu(t))
      .flatMap((sectionItems) =>
        sectionItems.flatMap((item) => {
          if (!item.view) return []
          if (item.subMenu?.length) {
            return item.subMenu
              .filter((subItem) => subItem.view && subItem.path)
              .map((subItem) => ({ ...subItem, parentLabel: item.label }))
          }
          return item.path ? [{ ...item, parentLabel: '' }] : []
        })
      )
      .map((action) => {
        const transactionType = action.path.match(/^\/pending\/transactions\/([^/]+)$/)?.[1]
        const transactionLabel = transactionType
          ? t(`analytics.source_types.${transactionType}`)
          : action.label

        return {
          ...action,
          label: transactionLabel,
          ...actionOverrides[action.path]
        }
      })

    const uniqueRoutes = visibleActions.reduce((actionMap, action) => {
      if (!actionMap.has(action.path)) {
        actionMap.set(action.path, action)
      }

      return actionMap
    }, new Map())

    const routeActions = Array.from(uniqueRoutes.values())
    const labelCounts = routeActions.reduce((labelMap, action) => {
      const normalizedLabel = action.label.trim().toLocaleLowerCase()
      labelMap.set(normalizedLabel, (labelMap.get(normalizedLabel) || 0) + 1)

      return labelMap
    }, new Map())

    const contextualActions = routeActions.map((action) => {
      const normalizedLabel = action.label.trim().toLocaleLowerCase()
      const hasDuplicateLabel = labelCounts.get(normalizedLabel) > 1

      if (hasDuplicateLabel && action.parentLabel) {
        return { ...action, label: `${action.parentLabel}: ${action.label}` }
      }

      return action
    })

    const quickPriorityMatchers = [
      (path) => path.startsWith('/registration/'),
      (path) => path.startsWith('/collection/regular/'),
      (path) => path.startsWith('/collection/pending/'),
      (path) => path === '/analytics',
      (path) => path === '/recycle-bin'
    ]

    const quickActions = quickPriorityMatchers.flatMap((matchesPath) =>
      contextualActions.filter((action) => matchesPath(action.path))
    )
    const quickPaths = new Set(quickActions.map((action) => action.path))
    let remainingActions = contextualActions.filter((action) => !quickPaths.has(action.path))

    const otherGroupDefinitions = [
      {
        id: 'approvals',
        label: t('menu.categories.Pending_Approval'),
        compactLabel: t('mobile.group_approvals'),
        icon: 'CheckPatch',
        matchesPath: (path) => path.startsWith('/pending/')
      },
      {
        id: 'registered-accounts',
        label: t('menu.label.registered_account_list'),
        compactLabel: t('mobile.group_registrations'),
        icon: 'List',
        matchesPath: (path) => path.startsWith('/registered/')
      },
      {
        id: 'setup',
        label: t('mobile.group_setup'),
        compactLabel: t('mobile.group_setup'),
        icon: 'Grid',
        matchesPath: (path) => ['/fields', '/centers', '/categories'].includes(path)
      },
      {
        id: 'financial-management',
        label: t('menu.label.account_management'),
        compactLabel: t('mobile.group_finance'),
        icon: 'BankTransfer',
        matchesPath: (path) => path === '/accounts' || path.startsWith('/accounts/')
      },
      {
        id: 'team-management',
        label: t('menu.label.staff'),
        compactLabel: t('mobile.group_team'),
        icon: 'Users',
        matchesPath: (path) => path === '/staffs' || path.startsWith('/staff-')
      },
      {
        id: 'audit-reports',
        label: t('menu.label.audit'),
        compactLabel: t('mobile.group_audit'),
        icon: 'AuditIcon',
        matchesPath: (path) => path.startsWith('/audit-report')
      },
      {
        id: 'system-settings',
        label: t('menu.label.settings_and_privacy'),
        compactLabel: t('mobile.group_settings'),
        icon: 'Settings',
        matchesPath: (path) => path.startsWith('/settings-and-privacy')
      }
    ]

    const otherActionGroups = otherGroupDefinitions.flatMap((group) => {
      const groupActions = remainingActions.filter((action) => group.matchesPath(action.path))
      remainingActions = remainingActions.filter((action) => !group.matchesPath(action.path))

      return groupActions.length > 0 ? [{ ...group, actions: groupActions }] : []
    })

    if (remainingActions.length > 0) {
      otherActionGroups.push({
        id: 'more-services',
        label: t('mobile.more_services'),
        icon: 'Grid',
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
        <DynamicIcon icon={action.icon} size={25} stroke="currentColor" color="currentColor" />
      </span>
      <span className="mobile-quick-actions__label">{action.label}</span>
    </Link>
  )

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
            {otherActionGroups.map((group) => {
              if (group.actions.length === 1) {
                return renderAction(group.actions[0])
              }

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
                    <DynamicIcon
                      icon={group.icon}
                      size={25}
                      stroke="currentColor"
                      color="currentColor"
                    />
                    <small className="mobile-quick-actions__group-count">
                      {group.actions.length}
                    </small>
                  </span>
                  <span className="mobile-quick-actions__label">
                    {group.compactLabel || group.label}
                  </span>
                </button>
              )
            })}
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
                  <small>{t('mobile.other_services')}</small>
                  <h3 id="mobile-action-group-sheet-title">{activeGroup.label}</h3>
                </div>
                <button
                  type="button"
                  ref={activeGroupCloseRef}
                  onClick={closeGroupMenu}
                  aria-label={t('mobile.close_menu')}>
                  <XCircle size={22} />
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
