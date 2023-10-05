import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import FieldUpdate from '../../components/field/FieldUpdate'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import StaffRegistration from '../../components/staff/StaffRegistration'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import Clock from '../../icons/Clock'
import Edit from '../../icons/Edit'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import UserPlus from '../../icons/UserPlus'
import { FieldTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import '../staffs/staffs.scss'

export default function Field() {
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false)
  const [isFieldUpdateModalOpen, setIsFieldUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableField, setEditableField] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: fields } = [], mutate, isLoading, isError } = useFetch({ action: 'fields' })

  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={value ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
    />
  )
  const actionBtnGroup = (id, field) => (
    <ActionBtnGroup>
      {authPermissions.includes('field_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => fieldEdit(field)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('field_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => fieldDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('field_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => fieldActionHistory(field.field_action_history)}>
            {<Clock size={20} />}
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
      FieldTableColumns(
        t,
        windowWidth,
        statusSwitch,
        actionBtnGroup,
        !checkPermissions(
          ['field_data_update', 'field_soft_delete', 'field_action_history'],
          authPermissions
        ),
        descParser
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const toggleStatus = (id, isChecked) => {
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(
      `fields/change-status/${id}`,
      { status: isChecked },
      null,
      accessToken,
      null,
      'PUT'
    ).then((response) => {
      toast.dismiss(toasterLoading)
      if (response?.success) {
        toast.success(response?.message)
        mutate()
        return
      }
      toast.error(response?.message)
    })
  }

  const fieldEdit = (field) => {
    setEditableField({
      id: field?.id,
      name: field?.name,
      description: field?.description
    })
    setIsFieldUpdateModalOpen(true)
  }

  const fieldActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const fieldDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`fields/${id}`, null, null, accessToken, null, 'DELETE').then((response) => {
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
                { name: t('menu.label.field'), icon: <Globe size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('field.Field_Registration')}
              loading={false}
              endIcon={<UserPlus size={20} />}
              onclick={() => setIsFieldModalOpen(true)}
            />
            {isFieldModalOpen && (
              <StaffRegistration
                isOpen={isFieldModalOpen}
                setIsOpen={setIsFieldModalOpen}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isFieldUpdateModalOpen && Object.keys(editableField).length && (
              <FieldUpdate
                isOpen={isFieldUpdateModalOpen}
                setIsOpen={setIsFieldUpdateModalOpen}
                data={editableField}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isActionHistoryModalOpen && (
              <ActionHistoryModal
                open={isActionHistoryModalOpen}
                setOpen={setIsActionHistoryModalOpen}
                t={t}
                actionHistory={actionHistory}
              />
            )}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !fields ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('field.Field_List')} columns={columns} data={fields} />
          )}
        </div>
      </section>
    </>
  )
}
