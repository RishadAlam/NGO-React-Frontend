import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import EditLoanAccountModal from '../../components/pendingReg/EditLoanAccountModal'
import ViewLoanAccountModal from '../../components/pendingReg/ViewLoanAccountModal'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { setLoanAccFields } from '../../helper/RegFormFieldsData'
import { clientRegApprovalAlert } from '../../helper/approvalAlert'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { permanentDeleteAlert } from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import BankTransferOut from '../../icons/BankTransferOut'
import CheckPatch from '../../icons/CheckPatch'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import { PendingLoanRegTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function PendingLoanReg() {
  const [viewLoanAccData, setViewLoanAccData] = useState()
  const [viewLoanAccDataModal, setViewLoanAccDataModal] = useState(false)
  const [editLoanAccData, setEditLoanAccData] = useState()
  const [editLoanAccDataModal, setEditLoanAccDataModal] = useState(false)
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
    data: { data: loanAccounts } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'client/registration/loan',
    queryParams: {
      fetch_pending_forms: true,
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
      loan: true
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
    options: !checkPermission('pending_loan_acc_list_view_as_admin', authPermissions)
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) =>
    checkPermission('pending_loan_acc_approval', authPermissions) && (
      <AndroidSwitch
        value={Number(value) ? true : false}
        toggleStatus={(e) => loanApproved(id, e.target.checked)}
        disabled={loading?.approval || false}
      />
    )

  const loanApproved = (id) => {
    clientRegApprovalAlert(t).then((result) => {
      if (result.isConfirmed) {
        setLoading({ ...loading, approval: true })
        const toasterLoading = toast.loading(`${t('common.approval')}...`)
        xFetch(`client/registration/loan/approved/${id}`, null, null, accessToken, null, 'PUT')
          .then((response) => {
            setLoading({ ...loading, approval: false })
            toast.dismiss(toasterLoading)
            if (response?.success) {
              toast.success(response?.message)
              mutate()
              return
            }
            toast.error(response?.message)
          })
          .catch((errResponse) => {
            setLoading({ ...loading, approval: false })
            toast.error(errResponse?.message)
          })
      }
    })
  }
  const actionBtnGroup = (id, account) => (
    <ActionBtnGroup>
      {checkPermissions(
        ['pending_loan_acc_list_view', 'pending_loan_acc_list_view_as_admin'],
        authPermissions
      ) && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton className="text-primary" onClick={() => viewLoanAccount(account)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {checkPermission('pending_loan_acc_update', authPermissions) && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => loanAccountEdit(account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {checkPermission('pending_loan_acc_permanently_delete', authPermissions) && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => loanAccountDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      PendingLoanRegTableColumns(
        t,
        windowWidth,
        avatar,
        statusSwitch,
        actionBtnGroup,
        !checkPermission('pending_loan_acc_approval', authPermissions),
        !checkPermissions(
          [
            'pending_loan_acc_list_view',
            'pending_loan_acc_list_view_as_admin',
            'pending_loan_acc_update',
            'pending_loan_acc_permanently_delete'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  const viewLoanAccount = (account) => {
    setViewLoanAccData(setLoanAccFields(account))
    setViewLoanAccDataModal(true)
  }

  const loanAccountEdit = (account) => {
    setEditLoanAccData(setLoanAccFields(account))
    setEditLoanAccDataModal(true)
  }

  const loanAccountDelete = (id) => {
    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`client/loan/force-delete/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.categories.Pending_Approval'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('loan.pending_loan_acc_reg_list'),
                  icon: <BankTransferOut />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        {viewLoanAccData && (
          <ViewLoanAccountModal
            open={viewLoanAccDataModal}
            setOpen={setViewLoanAccDataModal}
            accountData={viewLoanAccData}
            setAccountData={setViewLoanAccData}
          />
        )}
        {editLoanAccData && authPermissions.includes('pending_client_registration_update') && (
          <EditLoanAccountModal
            open={editLoanAccDataModal}
            setOpen={setEditLoanAccDataModal}
            accountData={editLoanAccData}
            setAccountData={setEditLoanAccData}
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
            {creators && <SelectBoxField label={t('common.creator')} config={creatorConfig} />}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !loanAccounts ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('loan.pending_loan_acc_reg_list')}
              columns={columns}
              data={loanAccounts}
            />
          )}
        </div>
      </section>
    </>
  )
}
