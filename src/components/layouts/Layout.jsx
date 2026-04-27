import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import { isEmpty } from '../../helper/isEmpty'

export default function Layout({ pageTitle = '' }) {
  const { t } = useTranslation()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const navigate = useNavigate()
  const isAutorized = useIsAuthorizedValue()
  const { company_name = '' } = useAppSettingsValue()
  const separator = !isEmpty(pageTitle) && !isEmpty(company_name) ? ' | ' : ''

  useEffect(() => {
    if (isAutorized) navigate(from, { replace: true })
  }, [isAutorized])

  return (
    <>
      <Helmet>
        <title>{`${t(pageTitle) + separator + company_name}`}</title>
      </Helmet>

      {!isAutorized && <Outlet />}
    </>
  )
}
