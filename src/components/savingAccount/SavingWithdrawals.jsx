import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { checkPermission } from '../../helper/checkPermission'
import useFetch from '../../hooks/useFetch'
import Eye from '../../icons/Eye'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { SavingWithdrawalStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ActionHistoryModal from '../_helper/actionHistory/ActionHistoryModal'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingWithdrawals() {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const [loading, setLoading] = useLoadingState({})
  const { t } = useTranslation()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data: withdrawals } = [],
    mutate,
    isLoading
  } = useFetch({
    action: 'withdrawal/saving',
    queryParams: { saving_account_id: id, date_range: JSON.stringify(dateRange) }
  })

  const actionBtnGroup = (id, withdrawal) => (
    <ActionBtnGroup>
      {authPermissions.includes('client_saving_account_withdrawal_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton
            className="text-primary"
            onClick={() => {
              setActionHistory(withdrawal?.saving_withdrawal_action_history || [])
              setIsActionHistoryModalOpen(true)
            }}>
            {<Eye size={20} />}
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
        !checkPermission('client_saving_account_withdrawal_action_history', authPermissions)
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
        {isLoading && !withdrawals ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={`${t('menu.withdrawal.Saving_Withdrawal')} ${t('common.list')}`}
            columns={columns}
            data={withdrawals}
          />
        )}
      </div>
    </>
  )
}
