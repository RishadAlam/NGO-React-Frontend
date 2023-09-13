import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import RoleRegistration from '../../components/roleRegistration/RoleRegistration'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { RolesTableColumns } from '../../resources/staticData/tableColumns'
import '../staffs/staffs.scss'

export default function StaffRoles() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: roles } = [], mutate, isLoading, isError } = useFetch({ action: 'roles' })

  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => editf(id)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
        <IconButton className="text-danger" onClick={() => deletef(id)}>
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
  // const data = useMemo(() => [], [])
  const editf = (id) => console.log(id)
  const deletef = (id) => console.log(id)

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
              onclick={() => setIsRoleModalOpen(true)}
            />
            <RoleRegistration
              isRoleModalOpen={isRoleModalOpen}
              setIsRoleModalOpen={setIsRoleModalOpen}
              t={t}
              mutate={mutate}
            />
          </div>
        </div>
        <div className="staff-table">
          {!isLoading && roles && (
            <ReactTable title={t('staff_roles.Staff_Role_List')} columns={columns} data={roles} />
          )}
        </div>
      </section>
    </>
  )
}
