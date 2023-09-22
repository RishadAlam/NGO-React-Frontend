import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import StaffPermissions from '../../components/staff/StaffPermissions'
import StaffRegistration from '../../components/staff/StaffRegistration'
import StaffUpdate from '../../components/staff/StaffUpdate'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import Badge from '../../components/utilities/Badge'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Clock from '../../icons/Clock'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import List from '../../icons/List'
import Reset from '../../icons/Reset'
import Trash from '../../icons/Trash'
import UserPlus from '../../icons/UserPlus'
import { StaffTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import './staffs.scss'

export default function Staffs() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isUserUpdateModalOpen, setIsUserUpdateModalOpen] = useState(false)
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] = useState(false)
  const [editableStaff, setEditableStaff] = useState(false)
  const [userPermissions, setUserPermissions] = useState([])
  const { accessToken, id: authId } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: staffs } = [], mutate, isLoading, isError } = useFetch({ action: 'users' })
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const pendingBadge = (value) => (
    <Badge
      name={value ? t('common.verified_at') : t('common.pending')}
      className={value ? 'bg-success' : 'bg-danger'}
    />
  )

  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={value ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )

  const actionBtnGroup = (id, staff) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="Permissions" arrow followCursor>
        <IconButton
          className="text-success"
          onClick={() => viewUserPermissions(id, staff?.permissions)}>
          {<List size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => staffEdit(staff)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      {authId !== id && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => staffDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
        <IconButton className="text-info" onClick={() => staffDelete(id)}>
          {<Clock size={20} />}
        </IconButton>
      </Tooltip>
      {authId !== id && (
        <Tooltip TransitionComponent={Zoom} title="Reset Password" arrow followCursor>
          <IconButton className="text-danger" onClick={() => staffDelete(id)}>
            {<Reset size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => StaffTableColumns(t, windowWidth, avatar, pendingBadge, statusSwitch, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(`users/change-status/${id}`, { status: isChecked }, null, accessToken, null, 'PUT').then(
      (response) => {
        toast.dismiss(toasterLoading)
        if (response?.success) {
          toast.success(response?.message)
          mutate()
          return
        }
        toast.error(response?.message)
      }
    )
  }

  const staffEdit = (staff) => {
    setEditableStaff({
      id: staff?.id,
      name: staff?.name,
      email: staff?.email,
      phone: staff?.phone,
      role: staff?.role_id
    })
    setIsUserUpdateModalOpen(true)
  }

  const viewUserPermissions = (id, permissions) => {
    setUserPermissions({ staff_id: id, staff_permissions: permissions })
    setIsUserPermissionsModalOpen(true)
  }

  const staffDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`users/${id}`, null, null, accessToken, null, 'DELETE').then((response) => {
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
                { name: t('menu.staffs.Staffs'), icon: <Home size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('staffs.Staff_Registration')}
              loading={false}
              endIcon={<UserPlus size={20} />}
              onclick={() => setIsUserModalOpen(true)}
            />
            {isUserModalOpen && (
              <StaffRegistration
                isOpen={isUserModalOpen}
                setIsOpen={setIsUserModalOpen}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isUserUpdateModalOpen && Object.keys(editableStaff).length && (
              <StaffUpdate
                isOpen={isUserUpdateModalOpen}
                setIsOpen={setIsUserUpdateModalOpen}
                data={editableStaff}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isUserPermissionsModalOpen && (
              <StaffPermissions
                isOpen={isUserPermissionsModalOpen}
                setIsOpen={setIsUserPermissionsModalOpen}
                data={userPermissions}
                authId={authId}
                t={t}
                modalTitle={t('staffs.Staff_Registration')}
                btnTitle={t('common.update')}
              />
            )}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !staffs ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('staffs.Staff_List')} columns={columns} data={staffs} />
          )}
        </div>
      </section>
    </>
  )
}
