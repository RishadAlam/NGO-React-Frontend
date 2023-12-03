import { create, rawReturn } from 'mutative'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ClientRegistrationFormFields from '../../components/clientRegistration/ClientRegistrationFormFields'
import Button from '../../components/utilities/Button'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import dateFormat from '../../libs/dateFormat'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import xFetch from '../../utilities/xFetch'

export default function ClientRegistration() {
  const [imageUri, setImageUri] = useState(profilePlaceholder)
  const [signatureURL, setSignatureURL] = useState(SignaturePlaceholder)
  const [loading, setLoading] = useLoadingState({})
  const { accessToken } = useAuthDataValue()
  const { client_reg_sign_is_required } = useApprovalConfigsValue()
  const { t } = useTranslation()

  const [clientData, setClientData] = useState(clientDataFields)
  const [errors, setErrors] = useState(clientDataErrs)

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

    xFetch('client/registration', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, clientRegistrationForm: false })
        if (response?.success) {
          toast.success(response.message)
          setClientData(clientDataFields)
          setImageUri(profilePlaceholder)
          setSignatureURL(SignaturePlaceholder)
          setErrors(clientDataErrs)
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

  return (
    <section className="staff">
      <div className="row align-items-center my-3">
        <div className="col-sm-12">
          <Breadcrumb
            breadcrumbs={[
              { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
              {
                name: t('menu.registration.Client_Registration'),
                icon: <UserPlus size={16} />,
                active: true
              }
            ]}
          />
        </div>
        <div className="col-sm-12 my-3">
          <div className="card">
            <form onSubmit={onSubmit}>
              <div className="card-header">
                <b className="text-uppercase">{t('menu.registration.Client_Registration')}</b>
              </div>
              <div className="card-body">
                {errors?.message && errors?.message !== '' && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{errors?.message}</strong>
                  </div>
                )}
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
                />
              </div>
              <div className="card-footer text-center">
                <Button
                  type="submit"
                  name={t('common.registration')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.clientRegistrationForm || false}
                  endIcon={<Save size={20} />}
                  disabled={loading?.clientRegistrationForm || false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const checkRequiredFields = (formFields, t, client_reg_sign_is_required) => {
  const validationErrors = {}

  if (client_reg_sign_is_required && isEmpty(formFields['signature'])) {
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
  'image',
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
const clientDataFields = {
  field_id: '',
  center_id: '',
  acc_no: '',
  name: '',
  father_name: '',
  husband_name: '',
  mother_name: '',
  nid: '',
  dob: dateFormat(new Date(), 'yyyy-MM-dd'),
  occupation: '',
  religion: '',
  gender: '',
  primary_phone: '',
  secondary_phone: '',
  image: '',
  signature: '',
  share: '',
  annual_income: '',
  bank_acc_no: '',
  bank_check_no: '',
  present_address: {
    street_address: '',
    city: '',
    word_no: '',
    post_office: '',
    police_station: '',
    district: '',
    division: ''
  },
  permanent_address: {
    street_address: '',
    city: '',
    word_no: '',
    post_office: '',
    police_station: '',
    district: '',
    division: ''
  },
  field: '',
  center: ''
}
const clientDataErrs = {
  field_id: '',
  center_id: '',
  acc_no: '',
  name: '',
  father_name: '',
  mother_name: '',
  nid: '',
  occupation: '',
  religion: '',
  gender: '',
  primary_phone: '',
  image: '',
  share: '',
  present_address: {
    street_address: '',
    city: '',
    post_office: '',
    police_station: '',
    district: '',
    division: ''
  },
  permanent_address: {
    street_address: '',
    city: '',
    post_office: '',
    police_station: '',
    district: '',
    division: ''
  }
}
