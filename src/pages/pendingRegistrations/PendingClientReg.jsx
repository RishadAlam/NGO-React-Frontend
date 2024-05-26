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
import EditClientProfileModal from '../../components/pendingReg/EditClientProfileModal'
import ViewClientProfileModal from '../../components/pendingReg/ViewClientProfileModal'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { clientRegApprovalAlert } from '../../helper/approvalAlert'
import { passwordCheckAlert, permanentDeleteAlert } from '../../helper/deleteAlert'
import { setProfileDataObj } from '../../helper/setProfileDataObj'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import CheckPatch from '../../icons/CheckPatch'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import UserPlus from '../../icons/UserPlus'
import { PendingClientRegTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function PendingClientReg() {
  const [viewProfileData, setViewProfileData] = useState()
  const [viewProfileDataModal, setViewProfileDataModal] = useState(false)
  const [editProfileData, setEditProfileData] = useState()
  const [editProfileDataModal, setEditProfileDataModal] = useState(false)
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const {
    data: { data: clientProfiles } = [],
    mutate,
    isLoading
  } = useFetch({
    action: 'client/registration/pending-forms'
  })

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
      disabled={loading?.approval || false}
    />
  )
  const toggleStatus = (id) => {
    clientRegApprovalAlert(t).then((result) => {
      if (result.isConfirmed) {
        setLoading({ ...loading, approval: true })
        const toasterLoading = toast.loading(`${t('common.approval')}...`)
        xFetch(`client/registration/approved/${id}`, null, null, accessToken, null, 'PUT')
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
  const actionBtnGroup = (id, profile) => (
    <ActionBtnGroup>
      {authPermissions.includes('pending_client_registration_list_view') && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton className="text-primary" onClick={() => viewClientProfile(profile)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_client_registration_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => clientProfileEdit(profile)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_client_registration_permanently_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => clientProfileDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => PendingClientRegTableColumns(t, windowWidth, avatar, statusSwitch, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  const viewClientProfile = (profile) => {
    setViewProfileData(setProfileDataObj(profile))
    setViewProfileDataModal(true)
  }

  const clientProfileEdit = (profile) => {
    setEditProfileData(setProfileDataObj(profile))
    setEditProfileDataModal(true)
  }

  const clientProfileDelete = (id) => {
    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((result) => {
          if (result.isConfirmed) {
            const toasterLoading = toast.loading(`${t('common.delete')}...`)
            xFetch(`client/force-delete/${id}`, null, null, accessToken, null, 'DELETE')
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
                  name: t('menu.categories.Pending_Approval'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('client.pending_client_reg_list'),
                  icon: <UserPlus size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        {viewProfileData && (
          <ViewClientProfileModal
            open={viewProfileDataModal}
            setOpen={setViewProfileDataModal}
            profileData={viewProfileData}
            setProfileData={setViewProfileData}
          />
        )}
        {editProfileData && authPermissions.includes('pending_client_registration_update') && (
          <EditClientProfileModal
            open={editProfileDataModal}
            setOpen={setEditProfileDataModal}
            profileData={editProfileData}
            mutate={mutate}
          />
        )}
        <div className="staff-table">
          {isLoading && !clientProfiles ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('client.pending_client_reg_list')}
              columns={columns}
              data={clientProfiles}
            />
          )}
        </div>
      </section>
    </>
  )
}
