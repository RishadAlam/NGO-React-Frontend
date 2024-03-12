import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { isEmpty } from '../../helper/isEmpty'
import NotFound from '../../pages/unauthorized/NotFound'

export default function RequirePermissions({ allowedPermissions, pageTitle = '' }) {
  const { t } = useTranslation()
  const { permissions } = useAuthDataValue()
  const { company_name = '' } = useAppSettingsValue()
  const separator = !isEmpty(pageTitle) && !isEmpty(company_name) ? ' | ' : ''

  return (
    <>
      <Helmet>
        <title>{`${t(pageTitle) + separator + company_name}`}</title>
      </Helmet>

      {allowedPermissions &&
      allowedPermissions?.some((permission) => permissions.includes(permission)) ? (
        <Outlet />
      ) : (
        <NotFound />
      )}
    </>
  )
}
