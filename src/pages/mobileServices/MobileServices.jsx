import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import MobileQuickActions from '../../components/mobile/MobileQuickActions'

export default function MobileServices() {
  const { t } = useTranslation()
  const { company_name = '' } = useAppSettingsValue()
  const pageTitle = [t('mobile.all_services'), company_name].filter(Boolean).join(' | ')

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="mobile-services-page d-md-none">
        <MobileQuickActions />
      </div>
    </>
  )
}
