import AccountTopMenus from '../_helper/AccountTopMenus'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function LoanAccount() {
  return (
    <>
      <AccountTopMenus prefix="loan-saving" />
      <RegisterBox className="shadow rounded-4">
        <AccountSummary />
      </RegisterBox>
    </>
  )
}
