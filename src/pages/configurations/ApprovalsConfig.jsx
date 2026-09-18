import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ApprovalConfigs from '../../components/approvalConfigs/ApprovalConfigs'
import TransferTransactionConfig from '../../components/approvalConfigs/TransferTransactionConfig'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Settings from '../../icons/Settings'
import Tool from '../../icons/Tool'
import MobileFetchBoundary from '../../components/mobile/MobileFetchBoundary'
import { useMediaQuery } from '@mui/material'

export default function ApprovalsConfig() {
  const { t } = useTranslation()
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const [allApprovals, setAllApprovals] = useState([])
  const [accTransferConfigs, setAccTransferConfigs] = useState([])
  const {
    data: { data: approvals } = [],
    mutate,
    isLoading,
    hasError
  } = useFetch({ action: 'approvals-config' })

  useEffect(() => {
    if (approvals?.length) {
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

        <MobileFetchBoundary
          hasError={hasError}
          hasData={approvals !== undefined}
          onRetry={mutate}
          errorKey="mobile.load_error"
          staleKey="mobile.stale_data">
          {mobile && !isLoading && approvals?.length === 0 ? (
            <p role="status">{t('mobile.empty_data')}</p>
          ) : (
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
          )}
        </MobileFetchBoundary>
      </section>
    </>
  )
}
