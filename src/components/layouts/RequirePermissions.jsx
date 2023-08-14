import { Outlet } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'

export default function RequirePermissions({ allowedPermissions }) {
  const authData = useAuthDataValue()
  console.log(allowedPermissions)
  console.log(authData.permissions)

  return (
    <>
      {allowedPermissions &&
      allowedPermissions.some((permission) => authData.permissions.includes(permission)) ? (
        <Outlet />
      ) : (
        'NO'
      )}
    </>
  )
}
