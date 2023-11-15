import { useTranslation } from 'react-i18next'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function ViewClientProfileModal({ open, setOpen, profileData }) {
  const { t } = useTranslation()

  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('client.pending_client_reg_list')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={24} />}
                onclick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>{t('common.image')}</p>
                <div className="img my-3">
                  <img src={profileData?.image_uri} alt={profileData?.name} />
                </div>
              </div>
              <div className="col-md-6">
                <p>{t('common.signature')}</p>
                <div className="img my-3">
                  <img src={profileData?.signature_uri} alt="signature" />
                </div>
              </div>
              <div className="col-md-6">
                <h6>
                  {t('common.field')} : <span>{profileData?.field?.name}</span>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </ModalPro>
    </>
  )
}
