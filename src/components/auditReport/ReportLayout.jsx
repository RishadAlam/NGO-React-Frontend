import { useTranslation } from 'react-i18next'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'

export default function ReportLayout({ title, desc, children }) {
  const { t } = useTranslation()
  const { company_name } = useAppSettingsValue()

  return (
    <div style={{ pageBreakAfter: 'always' }}>
      <div className="report-header text-center">
        <h3>{company_name}</h3>
        {title && <h5>{title}</h5>}
        <h5>{desc}</h5>
      </div>
      <div className="report-body mt-2 pb-5">{children}</div>
      <div className="report-footer pt-5">
        <div className="d-flex justify-content-between">
          <h4>{t('localization.domain.secretary')}</h4>
          <h4>{t('localization.domain.president')}</h4>
          <h4>{t('localization.domain.audit_officer')}</h4>
        </div>
      </div>
    </div>
  )
}
