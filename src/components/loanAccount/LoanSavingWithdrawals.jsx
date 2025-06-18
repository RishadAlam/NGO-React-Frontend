import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { checkPermissions } from '../../helper/checkPermission'
import { deleteWithdrawal } from '../../helper/collectionActions'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Trash from '../../icons/Trash'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { SavingWithdrawalStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ActionHistoryModal from '../_helper/actionHistory/ActionHistoryModal'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanSavingWithdrawals() {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const [loading, setLoading] = useLoadingState({})
  const { t } = useTranslation()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data: collection } = [],
    mutate,
    isLoading
  } = useFetch({
    action: 'withdrawal/loan-saving',
    queryParams: { loan_account_id: id, date_range: JSON.stringify(dateRange) }
  })

  const actionBtnGroup = (id, profile) => (
    <ActionBtnGroup>
      {authPermissions.includes('client_loan_account_saving_withdrawal_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton
            className="text-primary"
            onClick={() => {
              setActionHistory(profile?.loan_saving_withdrawal_action_history || [])
              setIsActionHistoryModalOpen(true)
            }}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('client_loan_account_saving_withdrawal_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => console.log(profile)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('client_loan_account_saving_withdrawal_permanently_delete') && (
        <Tooltip
          TransitionComponent={Zoom}
          title="Delete"
          arrow
          followCursor
          disabled={loading?.withdrawalDelete}>
          <IconButton
            className="text-danger"
            onClick={() =>
              deleteWithdrawal(
                'withdrawal/loan-saving',
                id,
                t,
                accessToken,
                mutate,
                loading,
                setLoading
              )
            }>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      SavingWithdrawalStatementsTableColumn(
        t,
        windowWidth,
        decodeHTMLs,
        actionBtnGroup,
        !checkPermissions(
          [
            'client_loan_account_saving_withdrawal_action_history',
            'client_loan_account_saving_withdrawal_update',
            'client_loan_account_saving_withdrawal_permanently_delete'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  return (
    <>
      {isActionHistoryModalOpen && (
        <ActionHistoryModal
          open={isActionHistoryModalOpen}
          setOpen={setIsActionHistoryModalOpen}
          actionHistory={actionHistory}
        />
      )}
      <div className="text-end my-3">
        <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
      </div>
      <div className="staff-table">
        {isLoading && !collection ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={`${t('menu.withdrawal.Loan_Saving_Withdrawal')} ${t('common.list')}`}
            columns={columns}
            data={collection}
          />
        )}
      </div>
    </>
  )
}
