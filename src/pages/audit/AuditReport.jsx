import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import PrintReportView from '../../components/auditReport/PrintReportView'
import ViewModal from '../../components/auditReport/ViewModal'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoaderSm from '../../components/loaders/LoaderSm'
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
  const reportPrint = useRef()
  const [report, setReport] = useState()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [editableData, setEditableData] = useState(false)
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

  const actionBtnGroup = (id, report) => (
    <ActionBtnGroup>
      {authPermissions.includes('cooperative_audit_report_view') && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.view')}
          arrow
          followCursor
          disabled={loading?.metaForm || false}>
          <IconButton
            className="text-primary"
            onClick={() => setReportView(report.data, report.financial_year)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('cooperative_audit_report_update') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => metaEdit(report, 1)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('cooperative_audit_report_print') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.print')} arrow followCursor>
          <span>
            <IconButton
              className="text-info"
              onClick={() => setReportPrint(report.data, report.financial_year)}
              disabled={loading?.print || false}>
              {loading?.print ? <LoaderSm size={20} className="ms-2" /> : <Print size={20} />}
            </IconButton>
          </span>
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

  const setReportView = (data, financial_year) => {
    setReport({ financial_year: financial_year, ...data })
    setIsViewModalOpen(true)
  }
  const setReportPrint = (data, financial_year) => {
    setReport({ financial_year: financial_year, ...data })
    setTimeout(() => {
      handlePrint()
    }, 1000)
  }

  const handlePrint = useReactToPrint({
    content: () => reportPrint.current,
    onBeforePrint: () => setLoading({ ...loading, print: true }),
    onAfterPrint: () => setLoading({ ...loading, print: false }),
    removeAfterPrint: true
  })

  const metaEdit = (metaData, isDefault = false) => {
    setEditableData({
      id: metaData?.id,
      meta_key: metaData?.meta_key,
      meta_value: metaData?.meta_value,
      audit_report_page_id: metaData?.audit_report_page_id,
      column_no: metaData?.column_no,
      is_default: isDefault
    })
    setIsUpdateModalOpen(true)
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
        {isViewModalOpen && (
          <ViewModal
            isOpen={isViewModalOpen}
            setIsOpen={setIsViewModalOpen}
            data={report}
            mutate={mutate}
          />
        )}
        <div className="d-none">
          {report && <PrintReportView data={report} innerRef={reportPrint} />}
        </div>
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
