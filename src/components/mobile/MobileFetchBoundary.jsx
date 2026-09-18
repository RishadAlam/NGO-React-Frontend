import { useRef, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function MobileFetchBoundary({ hasError, hasData, onRetry, children }) {
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const { t } = useTranslation()
  const [retrying, setRetrying] = useState(false)
  const retryInFlight = useRef(false)
  const showError = mobile && hasError

  const retry = async () => {
    if (retryInFlight.current) return
    retryInFlight.current = true
    setRetrying(true)
    try {
      await onRetry()
    } catch {
      // SWR retains its error for the persistent notice and another retry.
    } finally {
      retryInFlight.current = false
      setRetrying(false)
    }
  }

  return (
    <>
      {showError && (
        <section className="mobile-fetch-error" role="alert">
          <div className="mobile-fetch-error__message">
            <p>{t('mobile.collection_load_error')}</p>
            {hasData && <p>{t('mobile.stale_collection_data')}</p>}
          </div>
          <button
            type="button"
            className="mobile-fetch-error__retry"
            onClick={retry}
            disabled={retrying}
            aria-busy={retrying}>
            {t(retrying ? 'mobile.retrying' : 'mobile.retry')}
          </button>
        </section>
      )}
      {(!showError || hasData) && children}
    </>
  )
}
