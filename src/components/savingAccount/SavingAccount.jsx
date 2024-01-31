import AccountShortSummery from '../_helper/accountShortSummery/AccountShortSummery'
import AccountTopMenus from '../_helper/AccountTopMenus'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function SavingAccount() {
  return (
    <>
      <AccountTopMenus prefix="saving" />
      <RegisterBox className="shadow rounded-4">
        <AccountSummary />
      </RegisterBox>
      <AccountShortSummery prefix="saving" />
    </>
  )
}
