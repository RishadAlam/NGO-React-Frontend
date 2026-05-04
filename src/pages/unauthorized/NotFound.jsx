import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import AuthShell from '../../components/_helper/AuthShell'

const ArrowRightIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
)

const ShieldLockIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 3 5 6v6c0 5.25 3.4 8.92 7 10 3.6-1.08 7-4.75 7-10V6l-7-3Z" />
    <rect x="9" y="10" width="6" height="5" rx="1" />
    <path d="M10.5 10v-1a1.5 1.5 0 1 1 3 0v1" />
  </svg>
)

export default function NotFound({ embedded = false, permissionFallback = false }) {
  const { t } = useTranslation()
  const location = useLocation()
  const isPermissionFallback = permissionFallback === true

  const badge = isPermissionFallback
    ? t('auth.permission_denied_badge', 'Access Restricted')
    : t('auth.not_found_badge', 'Error 404')
  const title = isPermissionFallback
    ? t('auth.permission_denied_title', 'You do not have permission to access this page')
    : t('auth.not_found_title', 'Page not found')
  const subtitle = isPermissionFallback
    ? t(
        'auth.permission_denied_subtitle',
        'Please contact an administrator if you believe this is a mistake.'
      )
    : t(
        'auth.not_found_subtitle',
        'The page you are trying to open does not exist or may have been moved.'
      )
  const hint = isPermissionFallback
    ? t(
        'auth.permission_denied_hint',
        'If this section should be available for your role, ask an admin to review your permissions.'
      )
    : t(
        'auth.not_found_hint',
        'Check the link spelling or return using one of the shortcuts below.'
      )

  const content = (
    <div className={`auth-not-found${embedded ? ' auth-not-found--embedded' : ''}`}>
      <span className="auth-not-found__glow auth-not-found__glow--one" aria-hidden="true" />
      <span className="auth-not-found__glow auth-not-found__glow--two" aria-hidden="true" />

      <div className="auth-not-found__surface">
        <div className="auth-not-found__hero">
          {isPermissionFallback ? (
            <span className="auth-not-found__icon">
              <ShieldLockIcon />
            </span>
          ) : (
            <p className="auth-not-found__code">404</p>
          )}
          <p className="auth-not-found__hint">{hint}</p>
          {!isPermissionFallback && (
            <p className="auth-not-found__path" title={location.pathname}>
              {location.pathname}
            </p>
          )}
        </div>

        <div className="auth-not-found__actions">
          <Link className="auth-not-found__btn auth-not-found__btn--primary" to="/">
            <span>{t('auth.not_found_primary_cta', 'Go to dashboard')}</span>
            <ArrowRightIcon />
          </Link>
          {!isPermissionFallback && (
            <Link className="auth-not-found__btn auth-not-found__btn--ghost" to="/login">
              {t('auth.not_found_secondary_cta', 'Back to sign in')}
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  if (embedded) {
    return (
      <section className="auth-not-found-inline">
        <div className="auth-not-found-inline__head">
          <span className="auth-not-found-inline__badge">{badge}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {content}
      </section>
    )
  }

  return (
    <AuthShell badge={badge} title={title} subtitle={subtitle}>
      {content}
    </AuthShell>
  )
}
