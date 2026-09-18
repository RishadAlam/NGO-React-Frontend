import MobileFetchBoundary from '../../components/mobile/MobileFetchBoundary'
import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import IncomeCategoriesRegistration from '../../components/incomeCategories/IncomeCategoriesRegistration'
import IncomeCategoriesUpdate from '../../components/incomeCategories/IncomeCategoriesUpdate'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import MobilePermission from '../../components/mobile/MobilePermission'
import PermissionStatusSwitch from '../../components/mobile/PermissionStatusSwitch'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert, { passwordCheckAlert } from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Dollar from '../../icons/Dollar'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { IncomeCategoriesTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import '../staffs/staffs.scss'

export default function IncomeCategories() {
  const [isIncomeCategoriesModalOpen, setIsIncomeCategoriesModalOpen] = useState(false)
  const [isIncomeCategoriesUpdateModalOpen, setIsIncomeCategoriesUpdateModalOpen] = useState(false)
  const [editableIncomeCategories, setEditableIncomeCategories] = useState(false)
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const mobilePermissions = windowWidth < 768 ? authPermissions : null
  const {
    data: { data: incomeCategories } = [],
    mutate,
    isLoading,
    hasError
  } = useFetch({ action: 'accounts/incomes/categories' })

  const statusSwitch = (value, id) => (
    <PermissionStatusSwitch
      permission="income_category_data_update"
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )
  const actionBtnGroup = (id, incomeCategories) => (
    <ActionBtnGroup>
      {authPermissions.includes('income_category_data_update') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton
            className="text-warning"
            onClick={() => incomeCategoriesEdit(incomeCategories)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('income_category_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.delete')} arrow followCursor>
          <IconButton className="text-danger" onClick={() => incomeCategoriesDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      IncomeCategoriesTableColumns(
        t,
        windowWidth,
        statusSwitch,
        actionBtnGroup,
        !checkPermissions(
          ['income_category_data_update', 'income_category_soft_delete'],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, mobilePermissions]
  )

  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(
      `accounts/incomes/categories/change-status/${id}`,
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

  const incomeCategoriesEdit = (incomeCategories) => {
    setEditableIncomeCategories({
      id: incomeCategories?.id,
      name: incomeCategories?.name,
      description: incomeCategories?.description
    })
    setIsIncomeCategoriesUpdateModalOpen(true)
  }

  const incomeCategoriesDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`accounts/incomes/categories/${id}`, null, null, accessToken, null, 'DELETE')
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
              .catch((errResponse) =>
                successAlert(t('common.deleted'), errResponse?.message, 'error')
              )
          }
        })
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
                  name: t('menu.account_management.Income_Categories'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <MobilePermission permission="income_category_registration">
              <PrimaryBtn
                name={t('income_categories.Income_Categories_Registration')}
                loading={false}
                endIcon={<Pen size={20} />}
                onclick={() => setIsIncomeCategoriesModalOpen(true)}
              />
              {isIncomeCategoriesModalOpen && (
                <IncomeCategoriesRegistration
                  isOpen={isIncomeCategoriesModalOpen}
                  setIsOpen={setIsIncomeCategoriesModalOpen}
                  mutate={mutate}
                />
              )}
            </MobilePermission>
            {isIncomeCategoriesUpdateModalOpen && Object.keys(editableIncomeCategories).length && (
              <IncomeCategoriesUpdate
                isOpen={isIncomeCategoriesUpdateModalOpen}
                setIsOpen={setIsIncomeCategoriesUpdateModalOpen}
                data={editableIncomeCategories}
                mutate={mutate}
              />
            )}
          </div>
        </div>
        <MobileFetchBoundary
          hasError={hasError}
          hasData={incomeCategories !== undefined}
          onRetry={mutate}
          errorKey="mobile.load_error"
          staleKey="mobile.stale_data">
          <div className="staff-table">
            {isLoading && !incomeCategories ? (
              <ReactTableSkeleton />
            ) : (
              <ReactTable
                title={t('income_categories.Income_Categories_List')}
                columns={columns}
                data={incomeCategories}
              />
            )}
          </div>
        </MobileFetchBoundary>
      </section>
    </>
  )
}
