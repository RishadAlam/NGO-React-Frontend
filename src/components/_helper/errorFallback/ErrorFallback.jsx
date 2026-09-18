import AlertTriangle from '../../../icons/AlertTriangle'
import { useTranslation } from 'react-i18next'

export default function ErrorFallback({ error }) {
  const { t } = useTranslation()
  return (
    <div
      className="app-error-fallback alert alert-danger d-flex align-items-center justify-content-center"
      role="alert">
      <AlertTriangle size={30} />
      &nbsp;&nbsp;
      <div>{error.message || t('localization.shared.unexpected_error')}</div>
    </div>
  )
}
