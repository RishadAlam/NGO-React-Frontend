import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import MetaUpdate from '../../components/audit/MetaUpdate'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import useFetch from '../../hooks/useFetch'
import AuditIcon from '../../icons/AuditIcon'
import AuditReportIcon from '../../icons/AuditReportIcon'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Home from '../../icons/Home'
import Print from '../../icons/Print'
import { AuditReportTableColumns } from '../../resources/staticData/tableColumns'
import '../staffs/staffs.scss'

export default function AuditReport() {
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
    data: { data: auditReports } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'audit/report/co-operative' })

  const actionBtnGroup = (id, metaData, isDefault) => (
    <ActionBtnGroup>
      {authPermissions.includes('cooperative_audit_report_view') && !Number(isDefault) && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.view')}
          arrow
          followCursor
          disabled={loading?.metaForm || false}>
          <IconButton className="text-primary" onClick={() => metaDelete(id)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('cooperative_audit_report_update') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => metaEdit(metaData, isDefault)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('cooperative_audit_report_print') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.print')} arrow followCursor>
          <IconButton className="text-info">{<Print size={20} />}</IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      AuditReportTableColumns(
        t,
        windowWidth,
        actionBtnGroup,
        !checkPermissions(
          [
            'cooperative_audit_report_view',
            'cooperative_audit_report_update',
            'cooperative_audit_report_print'
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

  return (
    <>
      <section className="staff">
        <div className="my-3">
          <Breadcrumb
            breadcrumbs={[
              { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
              { name: t('menu.label.audit'), icon: <AuditIcon size={16} />, active: false },
              {
                name: t('menu.audit.audit_report'),
                icon: <AuditReportIcon size={22} />,
                active: true
              }
            ]}
          />
        </div>
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
        <div className="staff-table">
          {isLoading ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('menu.audit.audit_report')}
              columns={columns}
              data={auditReports}
              classnames="my-3"
            />
          )}
        </div>
      </section>
    </>
  )
}
