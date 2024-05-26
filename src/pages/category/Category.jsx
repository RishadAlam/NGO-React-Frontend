import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import CategoryRegistration from '../../components/category/CategoryRegistration'
import CategoryUpdate from '../../components/category/CategoryUpdate'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert, { passwordCheckAlert } from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import CheckCircle from '../../icons/CheckCircle'
import Chrome from '../../icons/Chrome'
import Clock from '../../icons/Clock'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import XCircle from '../../icons/XCircle'
import { CategoryTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import '../staffs/staffs.scss'

export default function Category() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isCategoryUpdateModalOpen, setIsCategoryUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableCategory, setEditableCategory] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [loading, setLoading] = useLoadingState({})
  const { data: { data: categories } = [], mutate, isLoading } = useFetch({ action: 'categories' })

  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
      disabled={loading?.changeStatus || false}
    />
  )
  const actionBtnGroup = (id, category) => (
    <ActionBtnGroup>
      {authPermissions.includes('category_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => categoryEdit(category)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('category_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton
            className="text-danger"
            onClick={() => categoryDelete(id)}
            disabled={loading?.itemDelete || false}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('category_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => categoryActionHistory(category.category_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const descParser = (value) => (
    <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
  )
  const savingLoanStatus = (value) =>
    Number(value) ? (
      <span className="text-success">
        <CheckCircle />
      </span>
    ) : (
      <span className="text-danger">
        <XCircle />
      </span>
    )

  const columns = useMemo(
    () =>
      CategoryTableColumns(
        t,
        windowWidth,
        statusSwitch,
        actionBtnGroup,
        !checkPermissions(
          ['category_data_update', 'category_soft_delete', 'category_action_history'],
          authPermissions
        ),
        descParser,
        savingLoanStatus
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  const toggleStatus = (id, isChecked) => {
    setLoading({ ...loading, changeStatus: true })
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(`categories/change-status/${id}`, { status: isChecked }, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, changeStatus: false })
        toast.dismiss(toasterLoading)
        if (response?.success) {
          toast.success(response?.message)
          mutate()
          return
        }
        toast.error(response?.message)
      })
      .catch((errResponse) => {
        setLoading({ ...loading, changeStatus: false })
        toast.error(errResponse?.message)
      })
  }

  const categoryEdit = (category) => {
    setEditableCategory({
      id: category?.id,
      name: category?.name,
      group: category?.group,
      description: category?.description,
      saving: Number(category?.saving) ? true : false,
      loan: Number(category?.loan) ? true : false
    })
    setIsCategoryUpdateModalOpen(true)
  }

  const categoryActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const categoryDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            setLoading({ ...loading, itemDelete: true })
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`categories/${id}`, null, null, accessToken, null, 'DELETE')
              .then((response) => {
                setLoading({ ...loading, itemDelete: false })
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
              .catch((errResponse) => {
                setLoading({ ...loading, itemDelete: false })
                successAlert(t('common.deleted'), errResponse?.message, 'error')
              })
          }
        })
      }
    })
  }

  return (
    <>
      <section className="staff">
        <div className="row align-items-category my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                { name: t('menu.label.category'), icon: <Chrome size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('category.Category_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsCategoryModalOpen(true)}
            />
            {isCategoryModalOpen && (
              <CategoryRegistration
                isOpen={isCategoryModalOpen}
                setIsOpen={setIsCategoryModalOpen}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isCategoryUpdateModalOpen && Object.keys(editableCategory).length && (
              <CategoryUpdate
                isOpen={isCategoryUpdateModalOpen}
                setIsOpen={setIsCategoryUpdateModalOpen}
                data={editableCategory}
                t={t}
                accessToken={accessToken}
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
        <div className="staff-table">
          {isLoading && !categories ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('category.Category_List')} columns={columns} data={categories} />
          )}
        </div>
      </section>
    </>
  )
}
