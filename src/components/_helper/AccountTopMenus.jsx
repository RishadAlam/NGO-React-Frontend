import { Check } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import { checkPermission } from '../../helper/checkPermission'
import CashWithdrawal from '../../icons/CashWithdrawal'
import Clock from '../../icons/Clock'
import Trash from '../../icons/Trash'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import ChangeAccountStatus from './ChangeAccountStatus'
import StoreAccountCheck from './StoreAccountCheck'
import StoreAccClosing from './clientACCClosing/StoreAccClosing'
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
  const [accountClosingModalOpen, setAccountClosingModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)

  return (
    <div className="d-flex justify-content-end mb-2">
      {prefix && (
        <>
          {((prefix === 'saving' &&
            checkPermission('permission_to_make_saving_withdrawal', authPermissions)) ||
            (prefix === 'loan-saving' &&
              checkPermission('permission_to_make_loan_saving_withdrawal', authPermissions))) && (
            <PrimaryBtn
              classNames="mx-1"
              name={t('common.withdrawal')}
              color="warning"
              loading={false}
              endIcon={<CashWithdrawal size={20} />}
              onclick={() => setWithdrawalModalOpen(true)}
            />
          )}
          {((prefix === 'saving' &&
            checkPermission('client_saving_account_check', authPermissions)) ||
            (prefix === 'loan-saving' &&
              checkPermission('client_loan_account_check', authPermissions))) && (
            <PrimaryBtn
              classNames="mx-1"
              name={t('common.account_check')}
              loading={false}
              endIcon={<Check />}
              onclick={() => setAccountCheckModalOpen(true)}
            />
          )}
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
          {((prefix === 'saving' &&
            !checkPermission('client_saving_account_closing', authPermissions)) ||
            (prefix === 'loan-saving' &&
              !checkPermission('client_loan_account_closing', authPermissions))) && (
            <PrimaryBtn
              classNames="mx-1"
              color="error"
              name={t('common.account_closing')}
              loading={false}
              endIcon={<Trash />}
              onclick={() => setAccountClosingModalOpen(true)}
            />
          )}
          {withdrawalModalOpen && (
            <StoreWithdrawal
              open={withdrawalModalOpen}
              setOpen={setWithdrawalModalOpen}
              prefix={prefix}
            />
          )}
          {accountClosingModalOpen && (
            <StoreAccClosing
              open={accountClosingModalOpen}
              setOpen={setAccountClosingModalOpen}
              prefix={prefix === 'loan-saving' ? 'loan' : prefix}
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
