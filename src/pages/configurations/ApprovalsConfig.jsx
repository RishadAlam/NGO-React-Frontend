import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import ApprovalConfigs from '../../components/approvalConfigs/ApprovalConfigs'
import TransferTransactionConfig from '../../components/approvalConfigs/TransferTransactionConfig'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Settings from '../../icons/Settings'
import Tool from '../../icons/Tool'

export default function ApprovalsConfig() {
  const { t } = useTranslation()
  const [loading, setLoading] = useLoadingState({})
  const [allApprovals, setAllApprovals] = useState([])
  const [accTransferConfigs, setAccTransferConfigs] = useState([])
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const {
    data: { data: approvals = [] } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'approvals-config' })

  useEffect(() => {
    if (approvals.length) {
      setAllApprovals(
        approvals.filter((approval) => approval.meta_key !== 'money_transfer_transaction')
      )
      setAccTransferConfigs(
        approvals
          .filter((approval) => approval.meta_key === 'money_transfer_transaction')
          .map((config) => config.meta_value)[0]
      )
    }
  }, [approvals])

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

        <div className="row my-3">
          <div className="col-lg-5 col-xl-4">
            <ApprovalConfigs
              allApprovals={allApprovals}
              isLoading={isLoading}
              setAllApprovals={setAllApprovals}
              mutate={mutate}
            />
          </div>
          <div className="col-lg-7 col-xl-8">
            <TransferTransactionConfig
              accTransferConfigs={accTransferConfigs}
              setAccTransferConfigs={setAccTransferConfigs}
              mutate={mutate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>
    </>
  )
}
