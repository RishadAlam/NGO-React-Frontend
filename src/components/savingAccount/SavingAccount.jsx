import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import AccountTopMenus from '../_helper/AccountTopMenus'
import AccountShortSummery from '../_helper/accountShortSummery/AccountShortSummery'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function SavingAccount() {
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
    </>
  )
}
