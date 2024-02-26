import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import CreateAuditReportMeta from '../../components/audit/CreateAuditReportMeta'
import MetaUpdate from '../../components/audit/MetaUpdate'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import deleteAlert from '../../helper/deleteAlert'
import successAlert from '../../helper/successAlert'
import useFetch from '../../hooks/useFetch'
import AuditIcon from '../../icons/AuditIcon'
import Clock from '../../icons/Clock'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { AuditReportMetaTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'
import '../staffs/staffs.scss'

export default function AuditReportMeta() {
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false)
  const [isMetaUpdateModalOpen, setIsMetaUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableMeta, setEditableMeta] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [loading, setLoading] = useLoadingState({})
  const {
    data: { data: metaKeys } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'audit/meta' })

  const actionBtnGroup = (id, metaData) => (
    <ActionBtnGroup>
      {authPermissions.includes('audit_report_meta_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => metaEdit(metaData)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('audit_report_meta_soft_delete') && (
        <Tooltip
          TransitionComponent={Zoom}
          title="Delete"
          arrow
          followCursor
          disabled={loading?.metaForm || false}>
          <IconButton className="text-danger" onClick={() => metaDelete(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('audit_report_meta_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => metaActionHistory(metaData.audit_report_meta_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      AuditReportMetaTableColumns(
        t,
        windowWidth,
        actionBtnGroup,
        !checkPermissions(
          [
            'audit_report_meta_update',
            'audit_report_meta_soft_delete',
            'audit_report_meta_action_history'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  const metaEdit = (metaData) => {
    setEditableMeta({
      id: metaData?.id,
      meta_key: metaData?.meta_key,
      meta_value: metaData?.meta_value,
      page_no: metaData?.page_no,
      column_no: metaData?.column_no
    })
    setIsMetaUpdateModalOpen(true)
  }

  const metaActionHistory = (actionHistory) => {
    setActionHistory(actionHistory)
    setIsActionHistoryModalOpen(true)
  }

  const metaDelete = (id) => {
    deleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        setLoading({ ...loading, metaForm: true })
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        xFetch(`audit/meta/${id}`, null, null, accessToken, null, 'DELETE')
          .then((response) => {
            setLoading({ ...loading, metaForm: false })
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
            setLoading({ ...loading, metaForm: false })
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
                { name: t('menu.label.audit'), icon: <AuditIcon size={16} />, active: false },
                { name: t('menu.audit.report_meta'), icon: <Edit size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('audit_report_meta.create_meta')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsMetaModalOpen(true)}
            />
            {isMetaModalOpen && (
              <CreateAuditReportMeta
                isOpen={isMetaModalOpen}
                setIsOpen={setIsMetaModalOpen}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isMetaUpdateModalOpen && Object.keys(editableMeta).length && (
              <MetaUpdate
                isOpen={isMetaUpdateModalOpen}
                setIsOpen={setIsMetaUpdateModalOpen}
                data={editableMeta}
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
          {isLoading && !metaKeys ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('audit_report_meta.audit_report_meta_list')}
              columns={columns}
              data={metaKeys}
            />
          )}
        </div>
      </section>
    </>
  )
}
