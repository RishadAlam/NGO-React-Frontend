import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingAccRegFormFields from '../../components/savingAccRegistration/SavingAccRegFormFields'
import Button from '../../components/utilities/Button'
import { setSavingFields } from '../../helper/RegFormFieldsData'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import xFetch from '../../utilities/xFetch'

export default function SavingAccReg() {
  const [loading, setLoading] = useLoadingState({})
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const { nominee_reg_sign_is_required } = useApprovalConfigsValue()
  const [savingAccData, setSavingAccData] = useState(setSavingFields)
  const [errors, setErrors] = useState(savingAccErrs)

  const onSubmit = (event) => {
    event.preventDefault()
    const validationErrors = checkRequiredFields(savingAccData, t, nominee_reg_sign_is_required)

    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(savingAccData)
    setLoading({ ...loading, SavingAccRegForm: true })

    xFetch('client/registration/saving', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, SavingAccRegForm: false })
        if (response?.success) {
          toast.success(response.message)
          setSavingAccData(() => setSavingFields())
          setErrors(savingAccErrs)
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
        setLoading({ ...loading, SavingAccRegForm: false })
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
                name: t('menu.registration.saving_account_registration'),
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
                <b className="text-uppercase">
                  {t('menu.registration.saving_account_registration')}
                </b>
              </div>
              <div className="card-body">
                {errors?.message && errors?.message !== '' && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{errors?.message}</strong>
                  </div>
                )}
                <SavingAccRegFormFields
                  formData={savingAccData}
                  setFormData={setSavingAccData}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.SavingAccRegForm}
                />
              </div>
              <div className="card-footer text-center">
                <Button
                  type="submit"
                  name={t('common.registration')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.SavingAccRegForm || false}
                  endIcon={<Save size={20} />}
                  disabled={loading?.SavingAccRegForm || false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const checkRequiredFields = (formFields, t, nominee_reg_sign_is_required) => {
  const validationErrors = {}

  for (const fieldName of fieldValidations) {
    if (isEmpty(formFields[fieldName])) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_required'
      )}`
    } else if (
      fieldName !== 'start_date' &&
      fieldName !== 'duration_date' &&
      fieldName !== 'acc_no' &&
      !Number(formFields[fieldName])
    ) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_invalid'
      )}`
    }
  }

  if (formFields.nominees && Array.isArray(formFields.nominees)) {
    const nomineesErr = formFields.nominees.map((nominee, key) => {
      const nomineeErrors = {}

      for (const nomineeField of [
        'name',
        'father_name',
        'mother_name',
        'nid',
        'dob',
        'occupation',
        'relation',
        'gender',
        'primary_phone'
      ]) {
        if (isEmpty(nominee[nomineeField])) {
          nomineeErrors[nomineeField] = `${t(`common.${nomineeField}`)} ${t(
            'common_validation.is_required'
          )}`
        }
      }

      if (isEmpty(nominee['image']) && isEmpty(nominee['image_uri'])) {
        nomineeErrors['image'] = `${t('common.image')} ${t('common_validation.is_required')}`
      }

      if (
        nominee_reg_sign_is_required &&
        isEmpty(nominee['signature']) &&
        isEmpty(nominee['signature_uri'])
      ) {
        nomineeErrors['signature'] = `${t('common.signature')} ${t(
          'common_validation.is_required'
        )}`
      }

      for (const addressField of addressFields) {
        if (isEmpty(nominee.address[addressField])) {
          nomineeErrors.address = nomineeErrors.address || {}
          nomineeErrors.address[addressField] = `${t(`common.${addressField}`)} ${t(
            'common_validation.is_required'
          )}`
        }
      }

      return nomineeErrors
    })

    for (let index = 0; index < nomineesErr.length; index++) {
      if (!isEmptyObject(nomineesErr[index])) {
        validationErrors.nominees = nomineesErr
      }
    }
  }

  return validationErrors
}

const fieldValidations = [
  'field_id',
  'center_id',
  'category_id',
  'creator_id',
  'acc_no',
  'client_registration_id',
  'start_date',
  'duration_date',
  'payable_deposit',
  'payable_installment',
  'payable_interest',
  'total_deposit_without_interest',
  'total_deposit_with_interest'
]

const addressFields = [
  'street_address',
  'city',
  'post_office',
  'police_station',
  'district',
  'division'
]

const setFormData = (fields) => {
  const formData = new FormData()

  for (const key in fields) {
    if (key !== 'nominees') {
      formData.append(key, fields[key])
    } else {
      fields[key].forEach((nominee, index) => {
        for (const nomineeKey in nominee) {
          if (nomineeKey !== 'address') {
            formData.append(`nominees[${index}][${nomineeKey}]`, nominee[nomineeKey])
          } else {
            for (const addressKey in nominee[nomineeKey]) {
              formData.append(
                `nominees[${index}][${nomineeKey}][${addressKey}]`,
                nominee[nomineeKey][addressKey]
              )
            }
          }
        }
      })
    }
  }

  return formData
}
const savingAccErrs = {
  field_id: '',
  center_id: '',
  creator_id: '',
  category_id: '',
  acc_no: '',
  duration_date: '',
  payable_deposit: '',
  payable_installment: '',
  payable_interest: '',
  total_deposit_without_interest: '',
  total_deposit_with_interest: '',
  nominees: [
    {
      name: '',
      father_name: '',
      mother_name: '',
      nid: '',
      occupation: '',
      relation: '',
      gender: '',
      primary_phone: '',
      image: '',
      address: {
        street_address: '',
        city: '',
        post_office: '',
        police_station: '',
        district: '',
        division: ''
      }
    }
  ]
}
