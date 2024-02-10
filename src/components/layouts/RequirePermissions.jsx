import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import NotFound from '../../pages/unauthorized/NotFound'

export default function RequirePermissions({ allowedPermissions, pageTitle = '' }) {
  const { permissions } = useAuthDataValue()
  const { company_name = '' } = useAppSettingsValue()

  return (
    <>
      <Helmet>
        <title>{`${pageTitle ? pageTitle + ' | ' : ''}${company_name}`}</title>
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
