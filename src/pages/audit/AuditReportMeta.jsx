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
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import deleteAlert, { passwordCheckAlert } from '../../helper/deleteAlert'
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
  const { data: { data: metaPages } = [], mutate, isLoading } = useFetch({ action: 'audit/meta' })

  const actionBtnGroup = (id, metaData, isDefault) => (
    <ActionBtnGroup>
      {authPermissions.includes('audit_report_meta_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => metaEdit(metaData, isDefault)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('audit_report_meta_soft_delete') && !Number(isDefault) && (
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

  const metaEdit = (metaData, isDefault = false) => {
    setEditableMeta({
      id: metaData?.id,
      meta_key: metaData?.meta_key,
      meta_value: metaData?.meta_value,
      audit_report_page_id: metaData?.audit_report_page_id,
      column_no: metaData?.column_no,
      is_default: isDefault
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
        passwordCheckAlert(t, accessToken).then((result) => {
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
                actionHistory={actionHistory}
              />
            )}
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !metaPages ? (
            <ReactTableSkeleton />
          ) : metaPages.length > 0 ? (
            metaPages.map((page, index) => (
              <ReactTable
                key={index}
                title={defaultNameCheck(
                  t,
                  page.is_default,
                  'audit_report_page.default.',
                  page.name
                )}
                columns={columns}
                data={page.audit_report_meta}
                classnames="my-3"
              />
            ))
          ) : (
            <p>{t('react_table.No_Records_Found')}</p>
          )}
        </div>
      </section>
    </>
  )
}
