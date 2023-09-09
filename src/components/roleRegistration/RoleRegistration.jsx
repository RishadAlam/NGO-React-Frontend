import Pen from '../../icons/Pen'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextInputField from '../utilities/TextInputField'

export default function RoleRegistration({ isRoleModalOpen, setIsRoleModalOpen, t }) {
  return (
    <>
      <ModalPro open={isRoleModalOpen} handleClose={() => setIsRoleModalOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('staff_roles.Staff_Roles_Registration')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={30} />}
                onclick={() => setIsRoleModalOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 mb-3">
                <TextInputField label="Name" defaultValue="" />
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <Button
              name={'Create'}
              className={'btn-primary py-2 px-3'}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsRoleModalOpen(false)}
            />
          </div>
        </div>
      </ModalPro>
    </>
  )
}
