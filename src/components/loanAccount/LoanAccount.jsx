import AccountTopMenus from '../_helper/clientACCwithdrawal/AccountTopMenus'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function LoanAccount() {
  return (
    <>
      <AccountTopMenus prefix="loan-saving" />
      <RegisterBox>
        <AccountSummary />
      </RegisterBox>
    </>
  )
}
