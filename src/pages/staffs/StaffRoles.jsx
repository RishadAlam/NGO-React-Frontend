import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import RoleRegistration from '../../components/staffRoles/RoleRegistration'
import RoleUpdate from '../../components/staffRoles/RoleUpdate'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { RolesTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import './staffs.scss'

export default function StaffRoles() {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [editRoleData, setEditRoleData] = useState({})
  const { accessToken } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: roles } = [], mutate, isLoading, isError } = useFetch({ action: 'roles' })

  const actionBtnGroup = (id, role) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
        <IconButton className="text-warning" onClick={() => roleEdit(role)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title={t('common.delete')} arrow followCursor>
        <IconButton className="text-danger" onClick={() => roleDelete(id)}>
          {<Trash size={20} />}
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => RolesTableColumns(t, windowWidth, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )
  const roleEdit = (role) => {
    setEditRoleData(role)
    setIsUpdateModalOpen(true)
  }
  const roleDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`roles/${id}`, null, null, accessToken, null, 'DELETE').then((response) => {
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
                { name: t('menu.staffs.Staff_Roles'), icon: <Home size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('staff_roles.Staff_Roles_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsRegModalOpen(true)}
            />
            {isRegModalOpen && (
              <RoleRegistration
                isOpen={isRegModalOpen}
                setIsOpen={setIsRegModalOpen}
                accessToken={accessToken}
                t={t}
                mutate={mutate}
              />
            )}
            {isUpdateModalOpen && Object.keys(editRoleData).length && (
              <RoleUpdate
                isOpen={isUpdateModalOpen}
                setIsOpen={setIsUpdateModalOpen}
                accessToken={accessToken}
                data={editRoleData}
                t={t}
                mutate={mutate}
              />
            )}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !roles ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('staff_roles.Staff_Role_List')} columns={columns} data={roles} />
          )}
        </div>
      </section>
    </>
  )
}
