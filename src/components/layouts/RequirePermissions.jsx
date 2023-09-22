import { Outlet } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import NotFound from '../../pages/unauthorized/NotFound'

export default function RequirePermissions({ allowedPermissions }) {
  const { permissions } = useAuthDataValue()

  return (
    <>
      {allowedPermissions &&
      allowedPermissions?.some((permission) => permissions.includes(permission)) ? (
        <Outlet />
      ) : (
        <NotFound />
      )}
    </>
  )
}
