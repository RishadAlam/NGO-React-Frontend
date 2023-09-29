import { create, rawReturn } from 'mutative'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import StaffPermissionSkeleton from '../../components/loaders/skeleton/StaffPermissionSkeleton'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Button from '../../components/utilities/Button'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import Settings from '../../icons/Settings'
import Tool from '../../icons/Tool'
import xFetch from '../../utilities/xFetch'

export default function ApprovalsConfig() {
  const { t } = useTranslation()
  const [loading, setLoading] = useLoadingState({})
  const [allApprovals, setAllApprovals] = useState([])
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const {
    data: { data: approvals = [] } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'approvals-config' })

  useEffect(() => {
    approvals.length && setAllApprovals(approvals)
  }, [approvals])
  const setChange = (id, isChecked) => {
    setAllApprovals((prevApprovals) =>
      create(prevApprovals, (draftApprovals) => {
        draftApprovals.find((approval) => {
          if (approval.id === id) {
            approval.meta_value = isChecked
          }
        })
      })
    )
    setError({})
  }

  const updatePermissions = (event) => {
    event.preventDefault()

    setLoading({ ...loading, ApprovalsConfig: true })
    xFetch('approvals-config-update', { approvals: allApprovals }, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, ApprovalsConfig: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          return
        }
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!response?.errors) {
              draftErr.message = response?.message
              return
            }
            return rawReturn(response?.errors || response)
          })
        )
      })
      .catch((errorResponse) => {
        setLoading({ ...loading, ApprovalsConfig: false })
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errorResponse?.errors) {
              draftErr.message = errorResponse?.message
              return
            }
            return rawReturn(errorResponse?.errors || errorResponse)
          })
        )
      })
  }

  return (
    <>
      <section className="staff-permissions">
        <Breadcrumb
          breadcrumbs={[
            { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
            {
              name: t('menu.label.settings_and_privacy'),
              icon: <Settings size={16} />,
              active: false
            },
            {
              name: t('menu.settings_and_privacy.approvals_config'),
              icon: <Tool size={16} />,
              active: true
            }
          ]}
        />

        {isLoading ? (
          <StaffPermissionSkeleton />
        ) : (
          <div className="card my-3 mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-header">
              <b className="text-uppercase">{t('menu.settings_and_privacy.approvals_config')}</b>
            </div>
            <div className="card-body">
              {error?.message && error?.message !== '' && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error?.message}</strong>
                </div>
              )}
              <ul className="mb-0">
                {allApprovals.length > 0 &&
                  allApprovals.map((approval) => (
                    <Fragment key={approval.id}>
                      <li>
                        <div className="row mb-2 align-items-center">
                          <div className="col-10">
                            <h6>{t(`approvals_config.${approval.meta_key}`)}</h6>
                          </div>
                          <div className="col-2 text-end text-success">
                            <AndroidSwitch
                              value={approval.meta_value}
                              toggleStatus={(e) => setChange(approval.id, e.target.checked)}
                            />
                          </div>
                        </div>
                      </li>
                    </Fragment>
                  ))}
              </ul>
            </div>
            <div className="card-footer text-center">
              <Button
                type="button"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.ApprovalsConfig || false}
                endIcon={<Save size={20} />}
                onclick={(e) => updatePermissions(e)}
                disabled={Object.keys(error).length || loading?.ApprovalsConfig}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
