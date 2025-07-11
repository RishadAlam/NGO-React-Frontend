import ModalPro from '../utilities/ModalPro'
import PrintReportView from './PrintReportView'

export default function ViewModal({ isOpen, setIsOpen, data }) {
  return (
    <>
      <ModalPro open={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="bg-white py-5" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <PrintReportView data={data} />
        </div>
      </ModalPro>
    </>
  )
}
