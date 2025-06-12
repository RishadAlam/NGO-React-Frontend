import { Check } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import CashWithdrawal from '../../icons/CashWithdrawal'
import Dollar from '../../icons/Dollar'
import Loan from '../../icons/Loan'
import SaveEnergy from '../../icons/SaveEnergy'
import AccountTopMenus from '../_helper/AccountTopMenus'
import AccountShortSummery from '../_helper/accountShortSummery/AccountShortSummery'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import TabPanel from '../utilities/TabPanel'
import TabsGroup from '../utilities/TabsGroup'
import AccountSummary from './AccountSummary'
import SavingAccountChecks from './SavingAccountChecks'
import SavingCollections from './SavingCollections'
import SavingTransactions from './SavingTransactions'
import SavingWithdrawals from './SavingWithdrawals'

export default function SavingAccount() {
  const [tabValue, setTabValue] = useState(1)
  const { id } = useParams()
  const { t } = useTranslation()

  const { data: { data = [] } = [], mutate } = useFetch({
    action: `client/registration/saving/${id}`
  })

  const statementTabs = [
    {
      label: t('account_transaction.Transaction_List'),
      value: 1,
      icon: (
        <span className="me-2">
          <Dollar />
        </span>
      )
    },
    {
      label: t('menu.label.regular_collection'),
      value: 2,
      icon: (
        <span className="me-2">
          <SaveEnergy />
        </span>
      )
    },
    {
      label: t('menu.withdrawal.Saving_Withdrawal'),
      value: 3,
      icon: (
        <span className="me-2">
          <CashWithdrawal />
        </span>
      )
    },
    {
      label: t('common.fee_collections'),
      value: 4,
      icon: (
        <span className="me-2">
          <Loan />
        </span>
      )
    },
    {
      label: t('common.account_check'),
      value: 5,
      icon: (
        <span className="me-2">
          <Check />
        </span>
      )
    }
  ]

  return (
    <>
      <AccountTopMenus
        status={data?.status}
        is_approved={data?.is_approved}
        is_acc_closed={data?.deleted_at}
        closing_req={data?.closing_req}
        mutate={mutate}
        prefix="saving"
        actionHistory={data.saving_account_action_history}
        actionHistoryPermission="client_saving_account_action_history"
      />
      <RegisterBox className="shadow rounded-4">
        <AccountSummary data={data} />
      </RegisterBox>
      <AccountShortSummery prefix="saving" />
      <RegisterBox className="shadow rounded-4 py-0">
        <TabsGroup defaultValue={tabValue} setValue={setTabValue} data={statementTabs} />
        <div className="border-bottom" />
      </RegisterBox>

      <TabPanel value={tabValue} index={1}>
        <SavingTransactions />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SavingCollections />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <SavingWithdrawals />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <SavingAccountChecks />
      </TabPanel>
    </>
  )
}
