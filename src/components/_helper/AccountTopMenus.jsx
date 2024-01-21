import { Check } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { checkPermission } from '../../helper/checkPermission'
import CashWithdrawal from '../../icons/CashWithdrawal'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import StoreAccountCheck from './StoreAccountCheck'
import StoreWithdrawal from './clientACCwithdrawal/StoreWithdrawal'

export default function AccountTopMenus({ prefix }) {
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [accountCheckModalOpen, setAccountCheckModalOpen] = useState(false)

  return (
    <div className="d-flex justify-content-end mb-2">
      {checkPermission('permission_to_make_saving_withdrawal', authPermissions) && (
        <PrimaryBtn
          classNames={'mx-3'}
          name={t('common.withdrawal')}
          loading={false}
          endIcon={<CashWithdrawal size={20} />}
          onclick={() => setWithdrawalModalOpen(true)}
        />
      )}
      <PrimaryBtn
        name={t('common.account_check')}
        loading={false}
        endIcon={<Check />}
        onclick={() => setAccountCheckModalOpen(true)}
      />
      {withdrawalModalOpen &&
        checkPermission('permission_to_make_saving_withdrawal', authPermissions) && (
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
