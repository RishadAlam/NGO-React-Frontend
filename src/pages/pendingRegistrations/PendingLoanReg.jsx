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
import ReactTable from '../../components/utilities/tables/ReactTable'
import { setLoanAccFields } from '../../helper/RegFormFieldsData'
import { clientRegApprovalAlert } from '../../helper/approvalAlert'
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
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const {
    data: { data: loanAccounts } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'client/registration/loan', queryParams: { fetch_pending_forms: true } })

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={value ? true : false}
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
      {authPermissions.includes('pending_loan_acc_list_view') && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton className="text-primary" onClick={() => viewLoanAccount(account)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_loan_acc_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => loanAccountEdit(account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_loan_acc_permanently_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => loanAccountDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => PendingLoanRegTableColumns(t, windowWidth, avatar, statusSwitch, actionBtnGroup),
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
