import ModalPro from '../utilities/ModalPro'
import PrintReportView from './PrintReportView'

export default function ViewModal({ isOpen, setIsOpen, data }) {
  return (
    <>
      <ModalPro open={isOpen} handleClose={() => setIsOpen(false)}>
        <PrintReportView data={data} />
      </ModalPro>
    </>
  )
}
