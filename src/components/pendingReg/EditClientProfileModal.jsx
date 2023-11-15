import { create } from 'mutative'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import dateFormat from '../../libs/dateFormat'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import ClientRegistrationFormFields from '../clientRegistration/ClientRegistrationFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function EditClientProfileModal({ open, setOpen, profileData, setProfileData }) {
  const [imageUri, setImageUri] = useState(profileData?.image_uri || profilePlaceholder)
  const [signatureUri, setSignatureUri] = useState(
    profileData?.signature_uri || SignaturePlaceholder
  )
  const [signatureModal, setSignatureModal] = useState(false)
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [errors, setErrors] = useState({})
  const { client_reg_sign_is_required } = useApprovalConfigsValue()

  const setChange = (val, name) => {
    if (name === 'image') {
      setImageUri(URL.createObjectURL(val))
    }
    setProfileData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field') {
          draftData.field_id = val?.id || ''
          draftData.field = val || null
          return
        }
        if (name === 'center') {
          draftData.center_id = val?.id || ''
          draftData.center = val || null
          return
        }
        if (name === 'dob') {
          draftData.dob = dateFormat(val, 'yyyy-MM-dd')
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        if (
          name !== 'husband_name' &&
          name !== 'secondary_phone' &&
          name !== 'annual_income' &&
          name !== 'bank_acc_no' &&
          name !== 'bank_check_no'
        ) {
          val === '' || val === null
            ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
            : delete draftErr[name]
        }
        if (name === 'primary_phone' || name === 'secondary_phone') {
          val.length === 11
            ? delete draftErr[name]
            : (draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_invalid')}`)
          if (name === 'secondary_phone' && val === '') {
            delete draftErr[name]
          }
        }
      })
    )
  }

  console.log(profileData)

  const closeModal = () => {
    setProfileData(undefined)
    setOpen(false)
  }

  return (
    <>
      <ModalPro open={open} handleClose={closeModal}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('client.pending_client_reg_list')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={24} />}
                onclick={closeModal}
              />
            </div>
          </div>
          <div className="card-body">
            {errors?.message && errors?.message !== '' && (
              <div className="alert alert-danger" role="alert">
                <strong>{errors?.message}</strong>
              </div>
            )}

            {profileData && (
              <ClientRegistrationFormFields
                imageUri={imageUri}
                signatureModal={signatureModal}
                setSignatureModal={setSignatureModal}
                signatureUri={signatureUri}
                setSignatureUri={setSignatureUri}
                clientData={profileData}
                setClientData={setProfileData}
                client_reg_sign_is_required={client_reg_sign_is_required}
                setChange={setChange}
                errors={errors}
                setErrors={setErrors}
                disabled={loading.ClientRegistration}
              />
            )}
          </div>
          <div className="card-footer text-end">
            <Button
              type="submit"
              name={t('common.update')}
              className={'btn-primary py-2 px-3'}
              loading={loading?.clientRegUpdate || false}
              endIcon={<Save size={20} />}
              disabled={Object.keys(errors).length || loading?.clientRegUpdate}
            />
          </div>
        </div>
      </ModalPro>
    </>
  )
}
