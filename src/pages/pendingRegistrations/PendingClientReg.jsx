import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import UserPlus from '../../icons/UserPlus'
import { PendingClientRegTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function PendingClientReg() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { accessToken } = useAuthDataValue()
  const {
    data: { data: clientProfiles } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'client/registration', queryParams: { fetch_pending: true } })

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={value ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )
  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    // xFetch(`users/change-status/${id}`, { status: isChecked }, null, accessToken, null, 'PUT')
    //   .then((response) => {
    //     toast.dismiss(toasterLoading)
    //     if (response?.success) {
    //       toast.success(response?.message)
    //       mutate()
    //       return
    //     }
    //     toast.error(response?.message)
    //   })
    //   .catch((errResponse) => toast.error(errResponse?.message))
  }
  const actionBtnGroup = (id, profile) => (
    <ActionBtnGroup>
      {/* <Tooltip TransitionComponent={Zoom} title="Permissions" arrow followCursor>
        <IconButton
          className="text-success"
          onClick={() => viewUserPermissions(id, profile?.permissions)}>
          {<List size={20} />}
        </IconButton>
      </Tooltip> */}
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => clientProfileEdit(profile)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
        <IconButton className="text-danger" onClick={() => clientProfileDelete(id)}>
          {<Trash size={20} />}
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => PendingClientRegTableColumns(t, windowWidth, avatar, statusSwitch, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const clientProfileEdit = (profile) => {
    // setEditableStaff({
    //   id: staff?.id,
    //   name: staff?.name,
    //   email: staff?.email,
    //   password: '',
    //   confirm_password: '',
    //   phone: staff?.phone,
    //   role: staff?.role_id
    // })
  }

  const clientProfileDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`client/registration/${id}`, null, null, accessToken, null, 'DELETE')
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
                  icon: <UserPlus size={16} />,
                  active: false
                },
                { name: t('menu.label.registration'), icon: <UserPlus size={16} />, active: true }
              ]}
            />
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !clientProfiles ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('staffs.Staff_List')} columns={columns} data={clientProfiles} />
          )}
        </div>
      </section>
    </>
  )
}
