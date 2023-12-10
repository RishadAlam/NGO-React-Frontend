import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import XCircle from '../../icons/XCircle'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import ClientRegistrationFormFields from '../clientRegistration/ClientRegistrationFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function ViewClientProfileModal({ open, setOpen, profileData, setProfileData }) {
  const { t } = useTranslation()
  const [imageUri, setImageUri] = useState(profileData?.image_uri || profilePlaceholder)
  const [signatureUri, setSignatureUri] = useState(
    profileData?.signature_uri || SignaturePlaceholder
  )

  const closeModal = () => {
    setProfileData(undefined)
    setOpen(false)
  }

  return (
    <ModalPro open={open} handleClose={closeModal}>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <b className="text-uppercase">{t('client.edit_client_profile')}</b>
            <Button
              className={'text-danger p-0'}
              loading={false}
              endIcon={<XCircle size={24} />}
              onclick={closeModal}
            />
          </div>
        </div>
        <div className="card-body">
          {profileData && (
            <ClientRegistrationFormFields
              imageUri={imageUri}
              signatureModal={false}
              setSignatureModal={setImageUri}
              signatureURL={signatureUri}
              setSignatureURL={setSignatureUri}
              clientData={profileData}
              setClientData={setProfileData}
              client_reg_sign_is_required={false}
              setChange={() => {}}
              errors={false}
              setErrors={() => {}}
              disabled={true}
            />
          )}
        </div>
      </div>
    </ModalPro>
  )
}
