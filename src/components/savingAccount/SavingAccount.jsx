import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'

export default function SavingAccount() {
  return (
    <>
      <RegisterBox>
        <AccountSummary />
      </RegisterBox>
    </>
  )
}
