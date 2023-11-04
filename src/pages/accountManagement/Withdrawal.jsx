import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import WithdrawalRegistration from '../../components/accountWithdrawal/WithdrawalRegistration'
import WithdrawalUpdate from '../../components/accountWithdrawal/WithdrawalUpdate'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import DateRangePickerInputField from '../../components/utilities/DateRangePickerInputField'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { WithdrawalTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function Withdrawal() {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
  const [isWithdrawalUpdateModalOpen, setIsWithdrawalUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableWithdrawal, setEditableWithdrawal] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const {
    data: { data: withdrawals } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'accounts/withdrawals',
    queryParams: { date_range: JSON.stringify(dateRange) }
  })

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const actionBtnGroup = (id, withdrawal) => (
    <ActionBtnGroup>
      {authPermissions.includes('account_withdrawal_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => withdrawalEdit(withdrawal)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('account_withdrawal_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => withdrawalDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('account_withdrawal_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => withdrawalActionHistory(withdrawal.account_withdrawal_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      WithdrawalTableColumns(
        t,
        windowWidth,
        actionBtnGroup,
        !checkPermissions(
          [
            'account_withdrawal_data_update',
            'account_withdrawal_soft_delete',
            'account_withdrawal_action_history'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const withdrawalEdit = (withdrawal) => {
    setEditableWithdrawal({
      id: withdrawal.id,
      amount: withdrawal.amount,
      previous_balance: withdrawal.previous_balance,
      balance: withdrawal.balance,
      description: withdrawal.description,
      date: new Date(withdrawal.date),
      category: withdrawal.withdrawal_category
    })
    setIsWithdrawalUpdateModalOpen(true)
  }

  const withdrawalActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const withdrawalDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`accounts/withdrawals/${id}`, null, null, accessToken, null, 'DELETE')
          .then((response) => {
            toast.dismiss(toasterLoading)
            if (response?.success) {
              successAlert(
                t('common.deleted'),
                response?.message || t('common_validation.data_has_been_deleted'),
                'success'
              )
              mutate()
              return
            }
            successAlert(t('common.deleted'), response?.message, 'error')
          })
          .catch((errResponse) => successAlert(t('common.deleted'), errResponse?.message, 'error'))
      }
    })
  }

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.account_management.Accounts'),
                  path: '/accounts',
                  icon: <Dollar size={16} />,
                  active: false
                },
                {
                  name: t('menu.account_management.Withdrawals'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('account_withdrawal.Withdrawal_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsWithdrawalModalOpen(true)}
            />
            {isWithdrawalModalOpen && (
              <WithdrawalRegistration
                isOpen={isWithdrawalModalOpen}
                setIsOpen={setIsWithdrawalModalOpen}
                mutate={mutate}
              />
            )}
            {isWithdrawalUpdateModalOpen && Object.keys(editableWithdrawal).length && (
              <WithdrawalUpdate
                isOpen={isWithdrawalUpdateModalOpen}
                setIsOpen={setIsWithdrawalUpdateModalOpen}
                data={editableWithdrawal}
                mutate={mutate}
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
        </div>
        <div className="text-end mb-3">
          <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
        </div>
        <div className="staff-table">
          {isLoading && !withdrawals ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('account_withdrawal.Withdrawal_List')}
              columns={columns}
              data={withdrawals}
            />
          )}
        </div>
      </section>
    </>
  )
}
