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
import LoanAccountChecks from './LoanAccountChecks'
import LoanCollections from './LoanCollections'
import LoanSavingWithdrawals from './LoanSavingWithdrawals'

export default function LoanAccount() {
  const [tabValue, setTabValue] = useState(1)
  const { id } = useParams()

  const { data: { data = [] } = [], mutate } = useFetch({
    action: `client/registration/loan/${id}`
  })
  return (
    <>
      <AccountTopMenus
        prefix="loan-saving"
        actionHistory={data.loan_account_action_history}
        actionHistoryPermission="client_loan_account_action_history"
        status={data?.status}
        is_approved={data?.is_approved}
        is_loan_approved={data?.is_loan_approved}
        is_acc_closed={data?.deleted_at}
        closing_req={data?.closing_req}
        mutate={mutate}
      />
      <RegisterBox className="shadow rounded-4">
        <AccountSummary data={data} />
      </RegisterBox>
      <AccountShortSummery prefix="loan" />

      <RegisterBox className="rounded-top-2 rounded-bottom-2 shadow rounded-4 py-0">
        <TabsGroup defaultValue={tabValue} setValue={setTabValue} data={AccStatementTabsNav()} />
        <div className="border-bottom" />
      </RegisterBox>

      <TabPanel value={tabValue} index={1}>
        {/* <SavingTransactions /> */}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <LoanCollections />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <LoanSavingWithdrawals />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <ClientAccountFees accountType="loan" />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <LoanAccountChecks />
      </TabPanel>
    </>
  )
}
