import { Check } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import { checkPermission } from '../../helper/checkPermission'
import CashWithdrawal from '../../icons/CashWithdrawal'
import Clock from '../../icons/Clock'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import ChangeAccountStatus from './ChangeAccountStatus'
import StoreAccountCheck from './StoreAccountCheck'
import StoreWithdrawal from './clientACCwithdrawal/StoreWithdrawal'

export default function AccountTopMenus({
  prefix,
  actionHistory = [],
  actionHistoryPermission,
  status,
  mutate
}) {
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [accountCheckModalOpen, setAccountCheckModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  console.log(
    prefix === 'saving' && checkPermission('client_saving_account_change_status', authPermissions)
  )
  return (
    <div className="d-flex justify-content-end mb-2">
      {prefix && (
        <>
          {checkPermission('permission_to_make_saving_withdrawal', authPermissions) && (
            <PrimaryBtn
              classNames="mx-1"
              name={t('common.withdrawal')}
              color="warning"
              loading={false}
              endIcon={<CashWithdrawal size={20} />}
              onclick={() => setWithdrawalModalOpen(true)}
            />
          )}
          <PrimaryBtn
            classNames="mx-1"
            name={t('common.account_check')}
            loading={false}
            endIcon={<Check />}
            onclick={() => setAccountCheckModalOpen(true)}
          />
          {((prefix === 'saving' &&
            checkPermission('client_saving_account_change_status', authPermissions)) ||
            (prefix === 'loan-saving' &&
              checkPermission('client_loan_account_change_status', authPermissions))) && (
            <ChangeAccountStatus
              prefix={prefix === 'loan-saving' ? 'loan' : prefix}
              status={status}
              mutate={mutate}
            />
          )}
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
        </>
      )}
      {checkPermission(actionHistoryPermission, authPermissions) && (
        <PrimaryBtn
          classNames="mx-1"
          name={t('common.action')}
          color="info"
          loading={false}
          endIcon={<Clock size={20} />}
          onclick={() => setIsActionHistoryModalOpen(true)}
        />
      )}
      {isActionHistoryModalOpen && (
        <ActionHistoryModal
          open={isActionHistoryModalOpen}
          setOpen={setIsActionHistoryModalOpen}
          t={t}
          actionHistory={actionHistory}
        />
      )}
    </div>
  )
}
