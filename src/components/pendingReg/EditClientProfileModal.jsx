import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import xFetch from '../../utilities/xFetch'
import ClientRegistrationFormFields from '../clientRegistration/ClientRegistrationFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function EditClientProfileModal({ open, setOpen, profileData, mutate }) {
  const [imageUri, setImageUri] = useState(profileData?.image_uri || profilePlaceholder)
  const [signatureURL, setSignatureURL] = useState(
    profileData?.signature_uri || SignaturePlaceholder
  )
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [errors, setErrors] = useState({ present_address: {}, permanent_address: {} })
  const [clientData, setClientData] = useState(profileData)
  const { client_reg_sign_is_required } = useApprovalConfigsValue()

  useEffect(() => {
    setClientData(profileData)
  }, [profileData])

  const onSubmit = (event) => {
    event.preventDefault()
    const validationErrors = checkRequiredFields(clientData, t, client_reg_sign_is_required)

    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(clientData)
    setLoading({ ...loading, clientRegistrationForm: false })

    xFetch(`client/registration/${profileData.id}`, formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, clientRegistrationForm: false })
        if (response?.success) {
          toast.success(response.message)
          setClientData({ present_address: {}, permanent_address: {} })
          setImageUri(profilePlaceholder)
          setSignatureURL(SignaturePlaceholder)
          setErrors({})
          setOpen(false)
          mutate()
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
    setClientData({ present_address: {}, permanent_address: {} })
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
                  setImageUri={setImageUri}
                  signatureURL={signatureURL}
                  setSignatureURL={setSignatureURL}
                  clientData={clientData}
                  setClientData={setClientData}
                  client_reg_sign_is_required={client_reg_sign_is_required}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.clientRegistrationForm}
                  editForm={true}
                />
              )}
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.clientRegistrationForm || false}
                endIcon={<Save size={20} />}
                disabled={loading?.clientRegistrationForm || false}
              />
            </div>
          </div>
        </form>
      </ModalPro>
    </>
  )
}

const checkRequiredFields = (formFields, t, client_reg_sign_is_required) => {
  const validationErrors = {}

  if (
    client_reg_sign_is_required &&
    isEmpty(formFields['signature']) &&
    isEmpty(formFields['signature_uri'])
  ) {
    validationErrors['signature'] = `${t('common.signature')} ${t('common_validation.is_required')}`
  }

  for (const fieldName of fieldValidations) {
    if (isEmpty(formFields[fieldName])) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_required'
      )}`
    } else if (
      fieldName === 'primary_phone' &&
      (!Number(formFields[fieldName]) ||
        formFields[fieldName].length !== 11 ||
        !String(formFields[fieldName]).startsWith('01'))
    ) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_invalid'
      )}`
    } else if (fieldName === 'share' && !Number(formFields[fieldName])) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_invalid'
      )}`
    }
  }

  for (const addressField of addressFields) {
    if (isEmpty(formFields.present_address[addressField])) {
      validationErrors['present_address'] = validationErrors['present_address'] || {}
      validationErrors['present_address'][addressField] = `${t(`common.${addressField}`)} ${t(
        'common_validation.is_required'
      )}`
    }
    if (isEmpty(formFields.permanent_address[addressField])) {
      validationErrors['permanent_address'] = validationErrors['permanent_address'] || {}
      validationErrors['permanent_address'][addressField] = `${t(`common.${addressField}`)} ${t(
        'common_validation.is_required'
      )}`
    }
  }

  return validationErrors
}

const setFormData = (fields) => {
  const formData = new FormData()
  formData.append('_method', 'PUT')

  for (const key in fields) {
    if (
      key !== 'field' &&
      key !== 'center' &&
      key !== 'present_address' &&
      key !== 'permanent_address'
    ) {
      formData.append(key, fields[key])
    } else if (key === 'present_address' || key === 'permanent_address') {
      for (const addressKey in fields[key]) {
        key === 'present_address'
          ? formData.append(`present_address[${addressKey}]`, fields[key][addressKey])
          : formData.append(`permanent_address[${addressKey}]`, fields[key][addressKey])
      }
    }
  }

  return formData
}

const fieldValidations = [
  'field_id',
  'center_id',
  'acc_no',
  'name',
  'father_name',
  'mother_name',
  'nid',
  'dob',
  'occupation',
  'religion',
  'gender',
  'primary_phone',
  'share'
]
const addressFields = [
  'street_address',
  'city',
  'post_office',
  'police_station',
  'district',
  'division'
]
