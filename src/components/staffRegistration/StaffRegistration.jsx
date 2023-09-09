import Pen from '../../icons/Pen'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import SelectDropdownField from '../utilities/SelectDropdownField'
import TextInputField from '../utilities/TextInputField'

export default function StaffRegistration({ isUserModalOpen, setIsUserModalOpen, t }) {
  return (
    <>
      <ModalPro open={isUserModalOpen} handleClose={() => setIsUserModalOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('staffs.Staff_Registration')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={30} />}
                onclick={() => setIsUserModalOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextInputField label={t('common.name')} defaultValue="" />
              </div>
              <div className="col-md-6 mb-3">
                <TextInputField label={t('common.email')} type="email" defaultValue="" />
              </div>
              <div className="col-md-6 mb-3">
                <TextInputField label={t('common.mobile')} type="number" defaultValue="" />
              </div>
              <div className="col-md-6 mb-3">
                <SelectDropdownField label={t('common.role')} defaultValue="" />
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <Button
              name={t('common.registration')}
              className={'btn-primary py-2 px-3'}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsUserModalOpen(false)}
            />
          </div>
        </div>
      </ModalPro>
    </>
  )
}
