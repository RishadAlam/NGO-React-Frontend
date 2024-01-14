import { useTranslation } from 'react-i18next'
import RegisterBox from '../register/RegisterBox'
import '../register/RegisterBox.scss'
import AccountSummary from './AccountSummary'
import AdditionalOP from './AdditionalOP'

export default function SavingAccount() {
  const { t } = useTranslation()

  return (
    <>
      <AdditionalOP />
      <RegisterBox>
        <AccountSummary />
      </RegisterBox>
    </>
  )
}
