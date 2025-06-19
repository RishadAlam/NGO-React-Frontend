import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import AccStatementTabsNav from '../../resources/staticData/AccStatementTabsNav'
import AccountTopMenus from '../_helper/AccountTopMenus'
import ClientAccountFees from '../_helper/ClientAccountFees'
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

  const { data: { data = [] } = [], mutate } = useFetch({
    action: `client/registration/saving/${id}`
  })

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

      <RegisterBox className="rounded-top-2 rounded-bottom-2 shadow rounded-4 py-0">
        <TabsGroup defaultValue={tabValue} setValue={setTabValue} data={AccStatementTabsNav()} />
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
      <TabPanel value={tabValue} index={4}>
        <ClientAccountFees accountType="saving" />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <SavingAccountChecks />
      </TabPanel>
    </>
  )
}
