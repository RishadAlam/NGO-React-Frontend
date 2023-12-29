import { useTranslation } from 'react-i18next'
import XCircle from '../../icons/XCircle'
import LoanAccRegFormFields from '../loanAccRegistration/LoanAccRegFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function ViewLoanAccountModal({ open, setOpen, accountData, setAccountData }) {
  const { t } = useTranslation()

  const closeModal = () => {
    setAccountData(undefined)
    setOpen(false)
  }

  return (
    <ModalPro open={open} handleClose={closeModal}>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <b className="text-uppercase">{t('saving.view_saving_acc')}</b>
            <Button
              className={'text-danger p-0'}
              loading={false}
              endIcon={<XCircle size={24} />}
              onclick={closeModal}
            />
          </div>
        </div>
        <div className="card-body">
          {accountData && (
            <LoanAccRegFormFields
              formData={accountData}
              setFormData={setAccountData}
              errors={false}
              setErrors={() => {}}
              disabled={true}
              editForm={true}
            />
          )}
        </div>
      </div>
    </ModalPro>
  )
}
