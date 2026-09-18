import MobileFetchBoundary from '../../components/mobile/MobileFetchBoundary'
import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import AccountRegistration from '../../components/accounts/AccountRegistration'
import AccountUpdate from '../../components/accounts/AccountUpdate'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
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
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { AccountTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function Accounts() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isAccountUpdateModalOpen, setIsAccountUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableAccount, setEditableAccount] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const mobilePermissions = windowWidth < 768 ? authPermissions : null
  const {
    data: { data: accounts } = [],
    mutate,
    isLoading,
    hasError
  } = useFetch({ action: 'accounts' })

  const statusSwitch = (value, id) => (
    <PermissionStatusSwitch
      permission="account_data_update"
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )
  const actionBtnGroup = (id, account) => (
    <ActionBtnGroup>
      {authPermissions.includes('account_data_update') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => accountEdit(account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('account_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.delete')} arrow followCursor>
          <IconButton className="text-danger" onClick={() => accountDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('account_action_history') && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.action_history.action_history')}
          arrow
          followCursor>
          <IconButton
            className="text-info"
            onClick={() => accountActionHistory(account.account_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const accInfo = (name, acc_no, acc_details) => (
    <ul>
      <li>
        <b>{name}</b>
      </li>
      <li>
        <p className="text-secondary">{acc_no}</p>
      </li>
      <li>
        <p className="text-secondary">{acc_details}</p>
      </li>
    </ul>
  )

  const accBalance = (total_in, total_out, balance) => (
    <ul>
      <li>
        <p className="text-nowrap">
          <b>{t('common.total_deposit')}</b> : ৳ {total_in}
        </p>
      </li>
      <li>
        <p className="text-nowrap">
          <b>{t('common.total_withdraw')}</b> : ৳ {total_out}
        </p>
      </li>
      <li>
        <p className="text-nowrap">
          <b>{t('common.balance')}</b> : ৳ {balance}
        </p>
      </li>
    </ul>
  )

  const columns = useMemo(
    () =>
      AccountTableColumns(
        t,
        windowWidth,
        statusSwitch,
        actionBtnGroup,
        !checkPermissions(
          ['account_data_update', 'account_soft_delete', 'account_action_history'],
          authPermissions
        ),
        accInfo,
        accBalance
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, mobilePermissions]
  )

  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(`accounts/change-status/${id}`, { status: isChecked }, null, accessToken, null, 'PUT')
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

  const accountEdit = (account) => {
    setEditableAccount({
      id: account?.id,
      name: account?.name,
      acc_no: account?.acc_no,
      acc_details: account?.acc_details
    })
    setIsAccountUpdateModalOpen(true)
  }

  const accountActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const accountDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`accounts/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.account_management.Accounts'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <MobilePermission permission="account_registration">
              <PrimaryBtn
                name={t('account.Account_Registration')}
                loading={false}
                endIcon={<Pen size={20} />}
                onclick={() => setIsAccountModalOpen(true)}
              />
              {isAccountModalOpen && (
                <AccountRegistration
                  isOpen={isAccountModalOpen}
                  setIsOpen={setIsAccountModalOpen}
                  mutate={mutate}
                />
              )}
            </MobilePermission>
            {isAccountUpdateModalOpen && Object.keys(editableAccount).length && (
              <AccountUpdate
                isOpen={isAccountUpdateModalOpen}
                setIsOpen={setIsAccountUpdateModalOpen}
                data={editableAccount}
                mutate={mutate}
              />
            )}
            {isActionHistoryModalOpen && (
              <ActionHistoryModal
                open={isActionHistoryModalOpen}
                setOpen={setIsActionHistoryModalOpen}
                actionHistory={actionHistory}
              />
            )}
          </div>
        </div>
        <MobileFetchBoundary
          hasError={hasError}
          hasData={accounts !== undefined}
          onRetry={mutate}
          errorKey="mobile.load_error"
          staleKey="mobile.stale_data">
          <div className="staff-table">
            {isLoading && !accounts ? (
              <ReactTableSkeleton />
            ) : (
              <ReactTable title={t('account.Account_List')} columns={columns} data={accounts} />
            )}
          </div>
        </MobileFetchBoundary>
      </section>
    </>
  )
}
