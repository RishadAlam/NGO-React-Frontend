import { useMediaQuery } from '@mui/material'
import { useAuthDataValue } from '../atoms/authAtoms'

// Desktop keeps its existing behavior. Mobile controls subscribe directly so
// permissions are current even when a table memoizes its cell renderers.
export default function useMobilePermission(permission) {
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const { permissions } = useAuthDataValue()
  const required = Array.isArray(permission) ? permission : [permission]
  return (
    !mobile || (Array.isArray(permissions) && required.some((grant) => permissions.includes(grant)))
  )
}
