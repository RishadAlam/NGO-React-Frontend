import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import DarkLangButton from '../darkLangButton/DarkLangButton'
import {
  applyThemePalette,
  DEFAULT_THEME_PALETTE,
  THEME_PALETTE_COOKIE
} from '../../resources/staticData/themePalettes'

export default function AuthShell({ title, subtitle, children, footer, badge }) {
  const { t } = useTranslation()

  useEffect(() => {
    const isDark = Cookies.get('isDark')
      ? JSON.parse(Cookies.get('isDark')) === true
      : false
    document.body.className = isDark ? 'dark' : 'light'
    const palette = Cookies.get(THEME_PALETTE_COOKIE) || DEFAULT_THEME_PALETTE
    applyThemePalette(palette, isDark ? 'dark' : 'light')
  }, [])

  return (
    <div className="auth-shell">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__beam aurora__beam--1" />
        <span className="aurora__beam aurora__beam--2" />
        <span className="aurora__beam aurora__beam--3" />
        <span className="aurora__dots" />
      </div>

      <div className="auth-watermark" aria-hidden="true">
        আমার সমিতি
      </div>

      <header className="auth-bar">
        <div className="auth-bar__brand">
          <div className="auth-bar__mark">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <defs>
                <linearGradient id="authMark" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--primary-color)" />
                  <stop offset="1" stopColor="var(--accent-color)" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#authMark)" />
              <path
                d="M9 22 L16 9 L23 22 M12 18 H20"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="auth-bar__name">
            <strong>আমার সমিতি</strong>
          </div>
        </div>

        <div className="auth-bar__controls">
          <DarkLangButton />
        </div>
      </header>

      <aside className="auth-side-tag" aria-hidden="true">
        <span className="line" />
        <span className="text">{t('auth.tagline_chip', 'Trusted Cooperative Finance')}</span>
        <span className="line" />
      </aside>

      <main className="auth-stage">
        <section className="auth-panel">
          <header className="auth-panel__head">
            <span className="auth-panel__chip">
              <span className="status-dot" />
              {t('auth.tagline_chip', 'Trusted Cooperative Finance')}
            </span>
            {badge && <span className="auth-panel__badge">{badge}</span>}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>

          <div className="auth-panel__body">{children}</div>

          {footer && <div className="auth-panel__foot">{footer}</div>}
        </section>
      </main>

      <footer className="auth-base">
        <small>© {new Date().getFullYear()} আমার সমিতি</small>
        <small className="auth-base__sep">·</small>
        <small>{t('auth.foot_rights', 'All rights reserved')}</small>
      </footer>
    </div>
  )
}
