import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import PrintReportView from './PrintReportView'

export default function ViewModal({ isOpen, setIsOpen, data }) {
  const { t } = useTranslation()
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const title = t('staff_permissions.group_name.cooperative_audit_report')
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <ModalPro open={isOpen} handleClose={closeModal} label={title}>
        {mobile ? (
          <div className="card mobile-report-dialog">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="h6 mb-0">{title}</h2>
                <Button
                  aria-label={t('localization.shared.close')}
                  className="text-danger p-0 mobile-dialog-close"
                  endIcon={<XCircle size={24} />}
                  onclick={closeModal}
                />
              </div>
            </div>
            <div className="card-body audit-report-view-modal bg-white">
              <PrintReportView data={data} />
            </div>
          </div>
        ) : (
          <div
            className="audit-report-view-modal bg-white py-5"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <PrintReportView data={data} />
          </div>
        )}
      </ModalPro>
    </>
  )
}
