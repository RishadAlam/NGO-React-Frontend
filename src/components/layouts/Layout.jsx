import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import { useIsLoadingValue } from '../../atoms/loaderAtoms'
import { isEmpty } from '../../helper/isEmpty'
import Illustration from '../../icons/Illustration'
import './layout.scss'

export default function Layout({ pageTitle = '' }) {
  const { t } = useTranslation()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const navigate = useNavigate()
  const isAutorized = useIsAuthorizedValue()
  const isLoading = useIsLoadingValue()
  const { company_name = '' } = useAppSettingsValue()
  const separator = !isEmpty(pageTitle) && !isEmpty(company_name) ? ' | ' : ''

  useEffect(() => {
    if (isAutorized) navigate(from, { replace: true })
  }, [isAutorized])

  // if (isLoading) {
  //   return <div>loading...</div>
  // }

  return (
    <>
      <Helmet>
        <title>{`${t(pageTitle) + separator + company_name}`}</title>
      </Helmet>

      {!isAutorized && (
        <div className="layout">
          <div className="container pt-5">
            <div className="row">
              <div className="col-lg-6 d-none d-lg-block">
                <a href="login-light-login.html" className="-intro-x d-flex align-items-center">
                  <img alt="logo" src="dist/images/logo.svg" />
                  <span className="text-white fs-lg ms-3">
                    {' '}
                    R<span className="fw-medium">A</span>{' '}
                  </span>
                </a>
                <div className="mt-3">
                  <Illustration size={300} stroke={'none'} />
                  <div className="layout-heading mt-5 text-white fw-semibold fs-4xl lh-base">
                    A few more clicks to
                    <br />
                    sign in to your account.
                  </div>
                  <div className="layout-heading-sm mt-3 fs-lg fw-normal text-white text-opacity-70 dark-text-gray-500">
                    Manage all Savings or Loan accounts in one place
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
