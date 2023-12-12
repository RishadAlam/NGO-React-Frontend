import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import IncomeRegistration from '../../components/income/IncomeRegistration'
import IncomeUpdate from '../../components/income/IncomeUpdate'
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
import tsNumbers from '../../libs/tsNumbers'
import { IncomeTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function Income() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
  const [isIncomeUpdateModalOpen, setIsIncomeUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableIncome, setEditableIncome] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const {
    data: { data: incomes } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'accounts/incomes',
    queryParams: { date_range: JSON.stringify(dateRange) }
  })

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const actionBtnGroup = (id, income) => (
    <ActionBtnGroup>
      {authPermissions.includes('income_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => incomeEdit(income)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('income_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => incomeDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('income_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => incomeActionHistory(income.income_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      IncomeTableColumns(
        t,
        windowWidth,
        actionBtnGroup,
        !checkPermissions(
          ['income_data_update', 'income_soft_delete', 'income_action_history'],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const incomeEdit = (income) => {
    setEditableIncome({
      id: income.id,
      income_category_id: income.income_category_id,
      amount: income.amount,
      previous_balance: income.previous_balance,
      balance: income.balance,
      description: income.description,
      date: new Date(income.date),
      category: income.income_category
    })
    setIsIncomeUpdateModalOpen(true)
  }

  const incomeActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const incomeDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`accounts/incomes/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.account_management.Incomes'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('income.Income_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsIncomeModalOpen(true)}
            />
            {isIncomeModalOpen && (
              <IncomeRegistration
                isOpen={isIncomeModalOpen}
                setIsOpen={setIsIncomeModalOpen}
                mutate={mutate}
              />
            )}
            {isIncomeUpdateModalOpen && Object.keys(editableIncome).length && (
              <IncomeUpdate
                isOpen={isIncomeUpdateModalOpen}
                setIsOpen={setIsIncomeUpdateModalOpen}
                data={editableIncome}
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
        <div className="row align-items-center">
          <div className="col-md-3">
            {incomes && (
              <b>
                {t('common.total')} {t('common.income')}:{' '}
                {tsNumbers(`৳${incomes?.reduce((sum, item) => sum + item.amount, 0)}/-`)}
              </b>
            )}
          </div>
          <div className="col-md-9 text-end">
            <div className="mb-3">
              <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
            </div>
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !incomes ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('income.Income_List')} columns={columns} data={incomes} />
          )}
        </div>
      </section>
    </>
  )
}
