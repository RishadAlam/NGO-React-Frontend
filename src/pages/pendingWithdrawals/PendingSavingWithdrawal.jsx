import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ApproveWithdrawalModal from '../../components/_helper/clientACCwithdrawal/ApproveWithdrawalModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import EditSavingAccountModal from '../../components/pendingReg/EditSavingAccountModal'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { setApprovalWithdrawalModalData, setSavingFields } from '../../helper/RegFormFieldsData'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { permanentDeleteAlert } from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import CashWithdrawal from '../../icons/CashWithdrawal'
import CheckPatch from '../../icons/CheckPatch'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import { PendingSavingWithdrawalTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function PendingSavingWithdrawal() {
  const [editWithdrawalAccData, setEditWithdrawalAccData] = useState()
  const [editWithdrawalAccDataModal, setEditWithdrawalAccDataModal] = useState(false)
  const [withdrawalAppData, setWithdrawalAppData] = useState()
  const [withdrawalAppModal, setWithdrawalAppModal] = useState(false)
  const [selectedField, setSelectedField] = useState()
  const [selectedCenter, setSelectedCenter] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedCreator, setSelectedCreator] = useState()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { id, accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const {
    data: { data: withdrawal } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'withdrawal/saving/pending',
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
    options: !checkPermission('pending_saving_acc_list_view_as_admin', authPermissions)
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, data) =>
    checkPermission('pending_saving_withdrawal_approval', authPermissions) && (
      <AndroidSwitch
        value={Number(value) ? true : false}
        toggleStatus={() => setApprovalData(data)}
        disabled={loading?.approval || false}
      />
    )

  const actionBtnGroup = (id, account) => (
    <ActionBtnGroup>
      {checkPermission('pending_saving_withdrawal_update', authPermissions) && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => savingAccountEdit(account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {checkPermission('pending_saving_withdrawal_delete', authPermissions) && (
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
      PendingSavingWithdrawalTableColumns(
        t,
        windowWidth,
        avatar,
        statusSwitch,
        descParser,
        actionBtnGroup,
        !checkPermission('pending_saving_withdrawal_approval', authPermissions),
        !checkPermissions(
          [
            'pending_saving_withdrawal_list_view',
            'pending_saving_withdrawal_list_view_as_admin',
            'pending_saving_withdrawal_update',
            'pending_saving_withdrawal_delete'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  const savingAccountEdit = (account) => {
    setEditWithdrawalAccData(setSavingFields(account))
    setEditWithdrawalAccDataModal(true)
  }

  const setApprovalData = (data) => {
    setWithdrawalAppData(setApprovalWithdrawalModalData(data))
    setWithdrawalAppModal(true)
  }

  const deleteWithdrawal = (id) => {
    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`withdrawal/saving/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.label.pending_withdrawals'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('menu.withdrawal.Saving_Withdrawal'),
                  icon: <CashWithdrawal size={18} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        {editWithdrawalAccData &&
          authPermissions.includes('pending_client_registration_update') && (
            <EditSavingAccountModal
              open={editWithdrawalAccDataModal}
              setOpen={setEditWithdrawalAccDataModal}
              accountData={editWithdrawalAccData}
              setAccountData={setEditWithdrawalAccData}
              mutate={mutate}
            />
          )}
        {withdrawalAppData && authPermissions.includes('pending_saving_withdrawal_approval') && (
          <ApproveWithdrawalModal
            open={withdrawalAppModal}
            setOpen={setWithdrawalAppModal}
            data={withdrawalAppData}
            mutate={mutate}
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
            {checkPermission('pending_saving_acc_list_view_as_admin', authPermissions) &&
              creators && <SelectBoxField label={t('common.creator')} config={creatorConfig} />}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !withdrawal ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('menu.withdrawal.Saving_Withdrawal')}
              columns={columns}
              data={withdrawal}
              footer={true}
            />
          )}
        </div>
      </section>
    </>
  )
}
