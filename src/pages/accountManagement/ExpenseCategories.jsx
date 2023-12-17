import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ExpenseCategoriesRegistration from '../../components/expenseCategories/ExpenseCategoriesRegistration'
import ExpenseCategoriesUpdate from '../../components/expenseCategories/ExpenseCategoriesUpdate'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Dollar from '../../icons/Dollar'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { ExpenseCategoriesTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import '../staffs/staffs.scss'

export default function ExpenseCategories() {
  const [isExpenseCategoriesModalOpen, setIsExpenseCategoriesModalOpen] = useState(false)
  const [isExpenseCategoriesUpdateModalOpen, setIsExpenseCategoriesUpdateModalOpen] =
    useState(false)
  const [editableExpenseCategories, setEditableExpenseCategories] = useState(false)
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data: expenseCategories } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'accounts/expenses/categories' })

  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )
  const actionBtnGroup = (id, expenseCategories) => (
    <ActionBtnGroup>
      {authPermissions.includes('expense_category_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton
            className="text-warning"
            onClick={() => expenseCategoriesEdit(expenseCategories)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('expense_category_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => expenseCategoriesDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      ExpenseCategoriesTableColumns(
        t,
        windowWidth,
        statusSwitch,
        actionBtnGroup,
        !checkPermissions(
          ['expense_category_data_update', 'expense_category_soft_delete'],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(
      `accounts/expenses/categories/change-status/${id}`,
      { status: isChecked },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        toast.dismiss(toasterLoading)
        if (response?.success) {
          toast.success(response?.message)
          mutate()
          return
        }
        toast.error(response?.message)
      })
      .catch((errResponse) => toast.error(errResponse?.message))
  }

  const expenseCategoriesEdit = (expenseCategories) => {
    setEditableExpenseCategories({
      id: expenseCategories?.id,
      name: expenseCategories?.name,
      description: expenseCategories?.description
    })
    setIsExpenseCategoriesUpdateModalOpen(true)
  }

  const expenseCategoriesDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`accounts/expenses/categories/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.account_management.Expense_Categories'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('expense_categories.Expense_Categories_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsExpenseCategoriesModalOpen(true)}
            />
            {isExpenseCategoriesModalOpen && (
              <ExpenseCategoriesRegistration
                isOpen={isExpenseCategoriesModalOpen}
                setIsOpen={setIsExpenseCategoriesModalOpen}
                mutate={mutate}
              />
            )}
            {isExpenseCategoriesUpdateModalOpen &&
              Object.keys(editableExpenseCategories).length && (
                <ExpenseCategoriesUpdate
                  isOpen={isExpenseCategoriesUpdateModalOpen}
                  setIsOpen={setIsExpenseCategoriesUpdateModalOpen}
                  data={editableExpenseCategories}
                  mutate={mutate}
                />
              )}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !expenseCategories ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('expense_categories.Expense_Categories_List')}
              columns={columns}
              data={expenseCategories}
            />
          )}
        </div>
      </section>
    </>
  )
}
