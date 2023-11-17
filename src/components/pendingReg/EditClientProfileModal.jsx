import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import dateFormat from '../../libs/dateFormat'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import xFetch from '../../utilities/xFetch'
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

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      profileData.field_id === '' ||
      profileData.center_id === '' ||
      profileData.acc_no === '' ||
      profileData.name === '' ||
      profileData.father_name === '' ||
      profileData.mother_name === '' ||
      profileData.nid === '' ||
      profileData.dob === '' ||
      profileData.occupation === '' ||
      profileData.religion === '' ||
      profileData.gender === '' ||
      profileData.primary_phone === '' ||
      profileData.image === '' ||
      profileData.share === '' ||
      profileData.present_address.street_address === '' ||
      profileData.present_address.city === '' ||
      profileData.present_address.post_office === '' ||
      profileData.present_address.police_station === '' ||
      profileData.present_address.district === '' ||
      profileData.present_address.division === '' ||
      profileData.permanent_address.street_address === '' ||
      profileData.permanent_address.city === '' ||
      profileData.permanent_address.post_office === '' ||
      profileData.permanent_address.police_station === '' ||
      profileData.permanent_address.district === '' ||
      profileData.permanent_address.division === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    if (client_reg_sign_is_required && profileData.signature === '') {
      toast.error(`${t(`common.signature`)} ${t('common_validation.is_required')}`)
      return
    }

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('field_id', profileData.field_id)
    formData.append('center_id', profileData.center_id)
    formData.append('acc_no', profileData.acc_no)
    formData.append('name', profileData.name)
    formData.append('father_name', profileData.father_name)
    formData.append('husband_name', profileData.husband_name)
    formData.append('mother_name', profileData.mother_name)
    formData.append('nid', profileData.nid)
    formData.append('dob', profileData.dob)
    formData.append('occupation', profileData.occupation)
    formData.append('religion', profileData.religion)
    formData.append('gender', profileData.gender)
    formData.append('primary_phone', profileData.primary_phone)
    formData.append('secondary_phone', profileData.secondary_phone)
    formData.append('image', profileData.image)
    formData.append('signature', profileData.signature)
    formData.append('annual_income', profileData.annual_income)
    formData.append('bank_acc_no', profileData.bank_acc_no)
    formData.append('bank_check_no', profileData.bank_check_no)
    formData.append('share', profileData.share)
    formData.append('present_address', JSON.stringify(profileData.present_address))
    formData.append('permanent_address', JSON.stringify(profileData.permanent_address))

    setLoading({ ...loading, clientRegistrationForm: true })
    xFetch('client/registration', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, clientRegistrationForm: false })
        if (response?.success) {
          toast.success(response.message)
          setProfileData(undefined)
          setImageUri(profilePlaceholder)
          setSignatureUri(SignaturePlaceholder)
          setErrors({})
          setOpen(false)
          return
        }
        setErrors((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!response?.errors) {
              draftErr.message = response?.message
              return
            }
            return rawReturn(response?.errors || response)
          })
        )
      })
      .catch((errResponse) => {
        setLoading({ ...loading, clientRegistrationForm: false })
        setErrors((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errResponse?.errors) {
              draftErr.message = errResponse?.message
              return
            }
            return rawReturn(errResponse?.errors || errResponse)
          })
        )
      })
  }

  const closeModal = () => {
    setProfileData(undefined)
    setOpen(false)
  }

  return (
    <>
      <ModalPro open={open} handleClose={closeModal}>
        <form onSubmit={onSubmit}>
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
        </form>
      </ModalPro>
    </>
  )
}
