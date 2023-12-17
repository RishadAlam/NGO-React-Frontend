import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import FieldRegistration from '../../components/field/FieldRegistration'
import FieldUpdate from '../../components/field/FieldUpdate'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
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
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
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
  const [loading, setLoading] = useLoadingState({})

  const statusSwitch = (value, id) => (
    <AndroidSwitch
      value={Number(value) ? true : false}
      toggleStatus={(e) => toggleStatus(id, e.target.checked)}
      disabled={loading?.changeStatus || false}
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
          <IconButton
            className="text-danger"
            onClick={() => fieldDelete(id)}
            disabled={loading?.itemDelete || false}>
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
    [t, windowWidth, loading]
  )

  const toggleStatus = (id, isChecked) => {
    setLoading({ ...loading, changeStatus: true })
    const toasterLoading = toast.loading(`${t('common.status')}...`)
    xFetch(`fields/change-status/${id}`, { status: isChecked }, null, accessToken, null, 'PUT')
      .then((response) => {
        toast.dismiss(toasterLoading)
        setLoading({ ...loading, changeStatus: false })
        if (response?.success) {
          toast.success(response?.message)
          mutate()
          return
        }
        toast.error(response?.message)
      })
      .catch((errResponse) => {
        setLoading({ ...loading, changeStatus: false })
        toast.error(errResponse?.message)
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
        setLoading({ ...loading, itemDelete: true })
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`fields/${id}`, null, null, accessToken, null, 'DELETE')
          .then((response) => {
            setLoading({ ...loading, itemDelete: false })
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
          .catch((errResponse) => {
            setLoading({ ...loading, itemDelete: false })
            successAlert(t('common.deleted'), errResponse?.message, 'error')
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
              endIcon={<Pen size={20} />}
              onclick={() => setIsFieldModalOpen(true)}
            />
            {isFieldModalOpen && (
              <FieldRegistration
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
