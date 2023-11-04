import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ExpenseRegistration from '../../components/expense/ExpenseRegistration'
import ExpenseUpdate from '../../components/expense/ExpenseUpdate'
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
import { ExpenseTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function Expense() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isExpenseUpdateModalOpen, setIsExpenseUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableExpense, setEditableExpense] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const {
    data: { data: expenses } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'accounts/expenses',
    queryParams: { date_range: JSON.stringify(dateRange) }
  })

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const actionBtnGroup = (id, expense) => (
    <ActionBtnGroup>
      {authPermissions.includes('expense_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => expenseEdit(expense)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('expense_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => expenseDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('expense_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => expenseActionHistory(expense.expense_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      ExpenseTableColumns(
        t,
        windowWidth,
        actionBtnGroup,
        !checkPermissions(
          ['expense_data_update', 'expense_soft_delete', 'expense_action_history'],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const expenseEdit = (expense) => {
    setEditableExpense({
      id: expense.id,
      expense_category_id: expense.expense_category_id,
      amount: expense.amount,
      previous_balance: expense.previous_balance,
      balance: expense.balance,
      description: expense.description,
      date: new Date(expense.date),
      category: expense.expense_category
    })
    setIsExpenseUpdateModalOpen(true)
  }

  const expenseActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const expenseDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`accounts/expenses/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.account_management.Expenses'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('expense.Expense_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsExpenseModalOpen(true)}
            />
            {isExpenseModalOpen && (
              <ExpenseRegistration
                isOpen={isExpenseModalOpen}
                setIsOpen={setIsExpenseModalOpen}
                mutate={mutate}
              />
            )}
            {isExpenseUpdateModalOpen && Object.keys(editableExpense).length && (
              <ExpenseUpdate
                isOpen={isExpenseUpdateModalOpen}
                setIsOpen={setIsExpenseUpdateModalOpen}
                data={editableExpense}
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
          {isLoading && !expenses ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('expense.Expense_List')} columns={columns} data={expenses} />
          )}
        </div>
      </section>
    </>
  )
}
