import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AuditIcon from '../../icons/AuditIcon'
import Clock from '../../icons/Clock'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import '../staffs/staffs.scss'

export default function AuditReportMeta() {
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false)
  const [isCenterUpdateModalOpen, setIsCenterUpdateModalOpen] = useState(false)
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [editableCenter, setEditableCenter] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [loading, setLoading] = useLoadingState({})
  //   const {
  //     data: { data: centers } = [],
  //     mutate,
  //     isLoading,
  //     isError
  //   } = useFetch({ action: 'centers' })

  const actionBtnGroup = (id, center) => (
    <ActionBtnGroup>
      {authPermissions.includes('center_data_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => centerEdit(center)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('center_soft_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton
            className="text-danger"
            onClick={() => centerDelete(id)}
            disabled={loading?.itemDelete || false}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('center_action_history') && (
        <Tooltip TransitionComponent={Zoom} title="Action History" arrow followCursor>
          <IconButton
            className="text-info"
            onClick={() => centerActionHistory(center.center_action_history)}>
            {<Clock size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  //   const columns = useMemo(
  //     () =>
  //       CenterTableColumns(
  //         t,
  //         windowWidth,
  //         actionBtnGroup,
  //         !checkPermissions(
  //           ['center_data_update', 'center_soft_delete', 'center_action_history'],
  //           authPermissions
  //         )
  //       ),
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     [t, windowWidth, loading]
  //   )

  //   const centerEdit = (center) => {
  //     setEditableCenter({
  //       id: center?.id,
  //       name: center?.name,
  //       field_id: center?.field_id,
  //       field: center?.field,
  //       description: center?.description
  //     })
  //     setIsCenterUpdateModalOpen(true)
  //   }

  //   const centerActionHistory = (actionHistory) => {
  //     setActionHistory(actionHistory)
  //     setIsActionHistoryModalOpen(true)
  //   }

  //   const centerDelete = (id) => {
  //     deleteAlert(t).then((result) => {
  //       if (result.isConfirmed) {
  //         setLoading({ ...loading, itemDelete: true })
  //         const toasterLoading = toast.loading(`${t('common.delete')}...`)
  //         xFetch(`centers/${id}`, null, null, accessToken, null, 'DELETE')
  //           .then((response) => {
  //             setLoading({ ...loading, itemDelete: false })
  //             toast.dismiss(toasterLoading)
  //             if (response?.success) {
  //               successAlert(
  //                 t('common.deleted'),
  //                 response?.message || t('common_validation.data_has_been_deleted'),
  //                 'success'
  //               )
  //               mutate()
  //               return
  //             }
  //             successAlert(t('common.deleted'), response?.message, 'error')
  //           })
  //           .catch((errResponse) => {
  //             setLoading({ ...loading, itemDelete: false })
  //             successAlert(t('common.deleted'), errResponse?.message, 'error')
  //           })
  //       }
  //     })
  //   }

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
          {/* <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('center.Center_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsCenterModalOpen(true)}
            />
            {isCenterModalOpen && (
              <CenterRegistration
                isOpen={isCenterModalOpen}
                setIsOpen={setIsCenterModalOpen}
                t={t}
                accessToken={accessToken}
                mutate={mutate}
              />
            )}
            {isCenterUpdateModalOpen && Object.keys(editableCenter).length && (
              <CenterUpdate
                isOpen={isCenterUpdateModalOpen}
                setIsOpen={setIsCenterUpdateModalOpen}
                data={editableCenter}
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
          </div> */}
        </div>
        {/* <div className="staff-table">
          {isLoading && !centers ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('center.Center_List')} columns={columns} data={centers} />
          )}
        </div> */}
      </section>
    </>
  )
}
