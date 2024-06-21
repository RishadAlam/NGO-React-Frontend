import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ApproveWithdrawalModal from '../../components/_helper/clientACCwithdrawal/ApproveWithdrawalModal'
import EditWithdrawalModal from '../../components/_helper/clientACCwithdrawal/EditWithdrawalModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { setApprovalWithdrawalModalData } from '../../helper/RegFormFieldsData'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { passwordCheckAlert, permanentDeleteAlert } from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import CheckPatch from '../../icons/CheckPatch'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import {
  PendingLoanClosingTableColumns,
  PendingSavingClosingTableColumns
} from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function PendingClosing({ prefix }) {
  const [editClosingAccData, setEditClosingAccData] = useState()
  const [editClosingAccDataModal, setEditClosingAccDataModal] = useState(false)
  const [withdrawalAppData, setClosingAppData] = useState()
  const [withdrawalAppModal, setClosingAppModal] = useState(false)
  const [selectedField, setSelectedField] = useState()
  const [selectedCenter, setSelectedCenter] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedCreator, setSelectedCreator] = useState()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { id, accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const endpoint = `closing/${prefix}`

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const {
    data: { data: closings } = [],
    mutate,
    isLoading
  } = useFetch({
    action: endpoint,
    queryParams: {
      field_id: selectedField?.id || '',
      center_id: selectedCenter?.id || '',
      category_id: selectedCategory?.id || '',
      user_id: selectedCreator?.id || ''
    }
  })
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: { field_id: selectedField?.id || '' }
  })
  const { data: { data: categories = [] } = [] } = useFetch({
    action: 'categories/active',
    queryParams: {
      saving: true
    }
  })

  const setParamsState = (option, name) => {
    if (name === 'field') {
      setSelectedField(option)
      setSelectedCenter(null)
    } else if (name === 'center') {
      setSelectedCenter(option)
    } else if (name === 'category') {
      setSelectedCategory(option)
    } else if (name === 'creator') {
      setSelectedCreator(option)
    }
    mutate()
  }

  const fieldConfig = {
    options: fields,
    value: selectedField || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'field'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => Number(center?.field_id) === Number(selectedField?.id) || '')
      : [],
    value: selectedCenter || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'center'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const categoryConfig = {
    options: categories,
    value: selectedCategory || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'category.default.', option.name),
    onChange: (e, option) => setParamsState(option, 'category'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const creatorConfig = {
    options: !checkPermission(`pending_${prefix}_acc_list_view_as_admin`, authPermissions)
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, data) =>
    checkPermission(`pending_req_to_delete_${prefix}_acc_approval`, authPermissions) && (
      <AndroidSwitch
        value={Number(value) ? true : false}
        toggleStatus={() => setApprovalData(data)}
        disabled={loading?.approval || false}
      />
    )

  const actionBtnGroup = (id, withdrawal) => (
    <ActionBtnGroup>
      {checkPermission(`pending_req_to_delete_${prefix}_acc_update`, authPermissions) && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => setWithdrawalEdit(withdrawal)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {checkPermission(`pending_req_to_delete_${prefix}_acc_delete`, authPermissions) && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => deleteWithdrawal(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const descParser = (value) => (
    <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
  )

  const columns = useMemo(
    () =>
      prefix === 'saving'
        ? PendingSavingClosingTableColumns(
            t,
            windowWidth,
            avatar,
            statusSwitch,
            descParser,
            actionBtnGroup,
            !checkPermission(`pending_req_to_delete_${prefix}_acc_approval`, authPermissions),
            !checkPermissions(
              [
                `pending_req_to_delete_${prefix}_acc_list_view`,
                `pending_req_to_delete_${prefix}_acc_list_view_as_admin`,
                `pending_req_to_delete_${prefix}_acc_update`,
                `pending_req_to_delete_${prefix}_acc_delete`
              ],
              authPermissions
            )
          )
        : PendingLoanClosingTableColumns(
            t,
            windowWidth,
            avatar,
            statusSwitch,
            descParser,
            actionBtnGroup,
            !checkPermission(`pending_req_to_delete_${prefix}_acc_approval`, authPermissions),
            !checkPermissions(
              [
                `pending_req_to_delete_${prefix}_acc_list_view`,
                `pending_req_to_delete_${prefix}_acc_list_view_as_admin`,
                `pending_req_to_delete_${prefix}_acc_update`,
                `pending_req_to_delete_${prefix}_acc_delete`
              ],
              authPermissions
            )
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading, prefix]
  )

  const setWithdrawalEdit = (account) => {
    setEditClosingAccData(setApprovalWithdrawalModalData(account))
    setEditClosingAccDataModal(true)
  }

  const setApprovalData = (data) => {
    setClosingAppData(setApprovalWithdrawalModalData(data))
    setClosingAppModal(true)
  }

  const deleteWithdrawal = (id) => {
    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`${endpoint}/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.label.pending_acc_delete_req'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name:
                    prefix === 'saving'
                      ? t('menu.delete.Saving_Delete')
                      : t('menu.delete.Loan_Delete'),
                  icon: <Trash size={18} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        {editClosingAccData &&
          authPermissions.includes(`pending_req_to_delete_${prefix}_acc_update`) && (
            <EditWithdrawalModal
              open={editClosingAccDataModal}
              setOpen={setEditClosingAccDataModal}
              withdrawal={editClosingAccData}
              setAccountData={setEditClosingAccData}
              prefix={prefix}
              mutate={mutate}
              category_id={editClosingAccData?.category?.id}
            />
          )}
        {withdrawalAppData &&
          authPermissions.includes(`pending_req_to_delete_${prefix}_acc_approval`) && (
            <ApproveWithdrawalModal
              open={withdrawalAppModal}
              setOpen={setClosingAppModal}
              data={withdrawalAppData}
              mutate={mutate}
              prefix={prefix}
            />
          )}
        <div className="row">
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            {fields && <SelectBoxField label={t('common.field')} config={fieldConfig} />}
          </div>
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            {centers && <SelectBoxField label={t('common.center')} config={centerConfig} />}
          </div>
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            {categories && <SelectBoxField label={t('common.category')} config={categoryConfig} />}
          </div>
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            {checkPermission(
              `pending_req_to_delete_${prefix}_acc_list_view_as_admin`,
              authPermissions
            ) &&
              creators && <SelectBoxField label={t('common.creator')} config={creatorConfig} />}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !closings ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={
                prefix === 'saving'
                  ? t('menu.withdrawal.Saving_Withdrawal')
                  : t('menu.withdrawal.Loan_Saving_Withdrawal')
              }
              columns={columns}
              data={closings}
            />
          )}
        </div>
      </section>
    </>
  )
}
