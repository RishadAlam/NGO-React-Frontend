import { create, rawReturn } from 'mutative'
import React, { Fragment, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Save from '../../icons/Save'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import StaffPermissionSkeleton from '../loaders/skeleton/StaffPermissionSkeleton'
import AndroidSwitch from '../utilities/AndroidSwitch'
import Button from '../utilities/Button'
import TextInputField from '../utilities/TextInputField'

export default function ApprovalConfigs({ allApprovals, isLoading, setAllApprovals, mutate }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useLoadingState({})
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()

  const setChange = (id, val) => {
    setAllApprovals((prevApprovals) =>
      create(prevApprovals, (draftApprovals) => {
        draftApprovals.find((approval) => {
          if (approval.id === id && approval.meta_key === 'client_reg_fee') {
            approval.meta_value = tsNumbers(val, true)
          } else if (approval.id === id) {
            approval.meta_value = val
          }
        })
      })
    )
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
      {isLoading || !allApprovals.length ? (
        <StaffPermissionSkeleton skeletonSize={3} />
      ) : (
        <div className="card my-3 mx-auto">
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
                    {approval.meta_key === 'client_reg_fee' ? (
                      <li>
                        <div className="row mb-2 align-items-center">
                          <div className="col-8">
                            <p>{t(`approvals_config.${approval.meta_key}`)}</p>
                          </div>
                          <div className="col-4 text-end text-success">
                            <div className="d-inline-block" style={{ maxWidth: '80px' }}>
                              <TextInputField
                                defaultValue={tsNumbers(approval.meta_value)}
                                setChange={(val) => setChange(approval.id, val)}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li>
                        <div className="row mb-2 align-items-center">
                          <div className="col-10">
                            <p>{t(`approvals_config.${approval.meta_key}`)}</p>
                          </div>
                          <div className="col-2 text-end text-success">
                            <AndroidSwitch
                              value={approval.meta_value}
                              toggleStatus={(e) => setChange(approval.id, e.target.checked)}
                            />
                          </div>
                        </div>
                      </li>
                    )}
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
    </>
  )
}
