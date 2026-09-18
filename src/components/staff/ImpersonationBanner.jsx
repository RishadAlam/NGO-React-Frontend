import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { getImpersonationSession, returnToOwnAccount } from '../../helper/impersonationSession'
import xFetch from '../../utilities/xFetch'
import './impersonation.scss'

export default function ImpersonationBanner() {
  const auth = useAuthDataValue()
  const [stored] = useState(getImpersonationSession)
  const { impersonation } = auth
  const name = impersonation ? auth.name : stored?.name
  const accessToken = impersonation
    ? auth.accessToken
    : stored
      ? `Bearer ${stored.accessToken}`
      : null
  const { t } = useTranslation()
  const [remaining, setRemaining] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const returning = useRef(false)
  const expiryHandled = useRef(false)

  useEffect(() => {
    if (!impersonation && !stored) return undefined
    const deadline = Math.min(
      stored?.expiresAt ?? Infinity,
      impersonation ? Date.now() + Number(impersonation.remaining_seconds || 0) * 1000 : Infinity
    )
    const update = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemaining(seconds)
      if (!seconds && !expiryHandled.current) {
        expiryHandled.current = true
        returnToOwnAccount()
      }
    }
    update()
    const interval = window.setInterval(update, 1000)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [impersonation, stored])

  if (!impersonation && !stored) return null

  const stop = async () => {
    if (returning.current) return
    returning.current = true
    setPending(true)
    setError('')
    try {
      const response = await xFetch('impersonation/stop', null, null, accessToken, null, 'POST')
      if (!response?.success) throw new Error(t('impersonation.return_failed'))
      returnToOwnAccount()
    } catch (failure) {
      if (failure?.status === 401) {
        returnToOwnAccount()
        return
      }
      returning.current = false
      setPending(false)
      setError(t('impersonation.return_failed'))
    }
  }

  const countdown = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  return (
    <aside className="impersonation-banner" aria-label={t('impersonation.session')}>
      <div className="impersonation-banner__message">
        <strong>{t('impersonation.viewing', { name })}</strong>
        <span>{t('impersonation.read_only')}</span>
        {error && <span role="alert">{error}</span>}
      </div>
      <span
        className="impersonation-banner__timer"
        role="timer"
        aria-label={t('impersonation.time_remaining')}>
        {countdown}
      </span>
      <button
        type="button"
        className="impersonation-banner__return"
        disabled={pending}
        onClick={stop}>
        {t(pending ? 'impersonation.returning' : 'impersonation.return')}
      </button>
    </aside>
  )
}
