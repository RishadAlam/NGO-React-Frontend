import { Check } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import { checkPermission } from '../../helper/checkPermission'
import CashWithdrawal from '../../icons/CashWithdrawal'
import Clock from '../../icons/Clock'
import Transactions from '../../icons/Transactions'
import Trash from '../../icons/Trash'
import '../register/RegisterBox.scss'
import PrimaryBtn from '../utilities/PrimaryBtn'
import ChangeAccountStatus from './ChangeAccountStatus'
import StoreAccountCheck from './StoreAccountCheck'
import StoreAccClosing from './clientACCClosing/StoreAccClosing'
import StoreTransaction from './clientACCwithdrawal/StoreTransaction'
import StoreWithdrawal from './clientACCwithdrawal/StoreWithdrawal'

export default function AccountTopMenus({
  prefix,
  actionHistory = [],
  actionHistoryPermission,
  status = false,
  is_approved = false,
  is_loan_approved = false,
  is_acc_closed = false,
  closing_req = false,
  mutate
}) {
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [accountCheckModalOpen, setAccountCheckModalOpen] = useState(false)
  const [accountClosingModalOpen, setAccountClosingModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)

  return (
    <div className="d-flex justify-content-end mb-2">
      {Boolean(closing_req) && (
        <span className="me-3 text-danger">{t('common.account_closing_msg')}</span>
      )}
      {!closing_req && prefix && Boolean(is_approved) && !is_acc_closed && (
        <>
          {((prefix === 'saving' && checkPermission('make_saving_transactions', authPermissions)) ||
            (prefix === 'loan-saving' &&
              checkPermission('make_loan_transactions', authPermissions))) && (
            <PrimaryBtn
              classNames="mx-1"
              name={t('common.send_money')}
              color="warning"
              loading={false}
              endIcon={<Transactions size={20} />}
              onclick={() => setTransactionModalOpen(true)}
            />
          )}
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
              Boolean(is_loan_approved) &&
              checkPermission('client_loan_account_change_status', authPermissions))) && (
            <ChangeAccountStatus
              prefix={prefix === 'loan-saving' ? 'loan' : prefix}
              status={status}
              mutate={mutate}
            />
          )}
          {((prefix === 'saving' &&
            checkPermission('client_saving_account_closing', authPermissions)) ||
            (prefix === 'loan-saving' &&
              checkPermission('client_loan_account_closing', authPermissions))) && (
            <PrimaryBtn
              classNames="mx-1"
              color="error"
              name={t('common.account_closing')}
              loading={false}
              endIcon={<Trash />}
              onclick={() => setAccountClosingModalOpen(true)}
            />
          )}
          {transactionModalOpen && (
            <StoreTransaction
              open={transactionModalOpen}
              setOpen={setTransactionModalOpen}
              prefix={prefix === 'loan-saving' ? 'loan' : prefix}
              mutate={mutate}
            />
          )}
          {withdrawalModalOpen && (
            <StoreWithdrawal
              open={withdrawalModalOpen}
              setOpen={setWithdrawalModalOpen}
              prefix={prefix}
              mutate={mutate}
            />
          )}
          {accountClosingModalOpen && (
            <StoreAccClosing
              open={accountClosingModalOpen}
              setOpen={setAccountClosingModalOpen}
              prefix={prefix === 'loan-saving' ? 'loan' : prefix}
              mutate={mutate}
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
          name={t('common.action_history.action_history')}
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
          actionHistory={actionHistory}
        />
      )}
    </div>
  )
}
