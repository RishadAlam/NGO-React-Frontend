import { Check, CurrencyExchange } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import WithdrawalModal from './WithdrawalModal'

export default function AdditionalOP() {
  const { id } = useParams()
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
        onclick={() => setIsFieldModalOpen(true)}
      />
      {withdrawalModalOpen && (
        <WithdrawalModal
          open={withdrawalModalOpen}
          setOpen={setWithdrawalModalOpen}
          modalTitle={t('common.withdrawal')}
          btnTitle={t('common.withdrawal')}
        />
      )}
    </div>
  )
}
