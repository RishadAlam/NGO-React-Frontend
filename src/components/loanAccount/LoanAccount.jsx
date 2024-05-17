import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import AccountTopMenus from '../_helper/AccountTopMenus'
import AccountShortSummery from '../_helper/accountShortSummery/AccountShortSummery'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function LoanAccount() {
  const { id } = useParams()

  const {
    data: { data = [] } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `client/registration/loan/${id}`
  })
  return (
    <>
      <AccountTopMenus
        prefix="loan-saving"
        actionHistory={data.loan_account_action_history}
        actionHistoryPermission="client_loan_account_action_history"
        status={data?.status}
        mutate={mutate}
      />
      <RegisterBox className="shadow rounded-4">
        <AccountSummary data={data} />
      </RegisterBox>
      <AccountShortSummery prefix="loan" />
    </>
  )
}
