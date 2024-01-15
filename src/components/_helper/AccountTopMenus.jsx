import { Check, CurrencyExchange } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import StoreAccountCheck from './StoreAccountCheck'
import StoreWithdrawal from './clientACCwithdrawal/StoreWithdrawal'

export default function AccountTopMenus({ prefix }) {
  const { t } = useTranslation()
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [accountCheckModalOpen, setAccountCheckModalOpen] = useState(false)

  return (
    <div className="d-flex justify-content-end mb-2">
      <PrimaryBtn
        classNames={'mx-3'}
        name={t('common.withdrawal')}
        loading={false}
        endIcon={<CurrencyExchange />}
        onclick={() => setWithdrawalModalOpen(true)}
      />
      <PrimaryBtn
        name={t('common.account_check')}
        loading={false}
        endIcon={<Check />}
        onclick={() => setAccountCheckModalOpen(true)}
      />
      {withdrawalModalOpen && (
        <StoreWithdrawal
          open={withdrawalModalOpen}
          setOpen={setWithdrawalModalOpen}
          prefix={prefix}
        />
      )}
      {accountCheckModalOpen && (
        <StoreAccountCheck
          open={accountCheckModalOpen}
          setOpen={setAccountCheckModalOpen}
          prefix={prefix === 'loan-saving' ? 'loan' : prefix}
        />
      )}
    </div>
  )
}
