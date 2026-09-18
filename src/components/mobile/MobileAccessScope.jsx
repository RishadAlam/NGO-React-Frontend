import { useMemo } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SWRConfig } from 'swr'
import { useAuthDataValue, useIsAuthorizedValue } from '../../atoms/authAtoms'

function MobileSession({ children }) {
  const config = useMemo(() => ({ provider: () => new Map() }), [])
  return <SWRConfig value={config}>{children}</SWRConfig>
}

// Route changes do not change this boundary. An identity/permission change does:
// stale action closures, open forms and role-scoped cached data are discarded
// together. Desktop/tablet retain their existing tree and cache behavior.
export default function MobileAccessScope({ children }) {
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const auth = useAuthDataValue()
  const authorized = useIsAuthorizedValue()
  const { t } = useTranslation()
  if (!mobile || !authorized) return children

  if (!Array.isArray(auth.permissions)) {
    return (
      <p className="mobile-services-empty" role="status">
        {t('mobile.permissions_unavailable')}
      </p>
    )
  }

  const permissions = [
    ...new Set(auth.permissions.filter((permission) => typeof permission === 'string'))
  ].sort()
  const sessionKey = JSON.stringify([auth.id, auth.accessToken, permissions])
  return <MobileSession key={sessionKey}>{children}</MobileSession>
}
