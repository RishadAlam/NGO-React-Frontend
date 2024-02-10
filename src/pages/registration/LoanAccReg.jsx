import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useApprovalConfigsValue } from '../../atoms/appApprovalConfigAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoanAccRegFormFields from '../../components/loanAccRegistration/LoanAccRegFormFields'
import Button from '../../components/utilities/Button'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import dateFormat from '../../libs/dateFormat'
import xFetch from '../../utilities/xFetch'

export default function LoanAccReg() {
  const [loading, setLoading] = useLoadingState({})
  const { accessToken } = useAuthDataValue()
  const { t } = useTranslation()
  const { guarantor_reg_sign_is_required } = useApprovalConfigsValue()
  const [loanAccData, setLoanAccData] = useState(loanAccFields)
  const [errors, setErrors] = useState(loanAccErrs)

  const onSubmit = (event) => {
    event.preventDefault()
    const validationErrors = checkRequiredFields(loanAccData, t, guarantor_reg_sign_is_required)

    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(loanAccData)
    setLoading({ ...loading, LoanAccRegForm: true })

    xFetch('client/registration/loan', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, LoanAccRegForm: false })
        if (response?.success) {
          toast.success(response.message)
          setLoanAccData(() => loanAccFields)
          setErrors(loanAccErrs)
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
        setLoading({ ...loading, LoanAccRegForm: false })
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
                name: t('menu.registration.loan_account_registration'),
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
                <b className="text-uppercase">{t('menu.registration.loan_account_registration')}</b>
              </div>
              <div className="card-body">
                {errors?.message && errors?.message !== '' && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{errors?.message}</strong>
                  </div>
                )}
                <LoanAccRegFormFields
                  formData={loanAccData}
                  setFormData={setLoanAccData}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.LoanAccRegForm}
                />
              </div>
              <div className="card-footer text-center">
                <Button
                  type="submit"
                  name={t('common.registration')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.LoanAccRegForm || false}
                  endIcon={<Save size={20} />}
                  disabled={loading?.LoanAccRegForm || false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const checkRequiredFields = (formFields, t, guarantor_reg_sign_is_required) => {
  const validationErrors = {}
  const fieldValidations = [
    'field_id',
    'center_id',
    'creator_id',
    'category_id',
    'client_registration_id',
    'acc_no',
    'start_date',
    'duration_date',
    'loan_given',
    'payable_installment',
    'payable_interest',
    'total_payable_interest',
    'total_payable_loan_with_interest',
    'loan_installment',
    'interest_installment',
    'total_payable_loan_installment'
  ]

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

  if (formFields.guarantors && Array.isArray(formFields.guarantors)) {
    const guarantorsErr = formFields.guarantors.map((guarantor, key) => {
      const guarantorErrors = {}
      const addressFields = [
        'street_address',
        'city',
        'post_office',
        'police_station',
        'district',
        'division'
      ]

      for (const guarantorField of [
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
        if (isEmpty(guarantor[guarantorField])) {
          guarantorErrors[guarantorField] = `${t(`common.${guarantorField}`)} ${t(
            'common_validation.is_required'
          )}`
        }
      }

      if (isEmpty(guarantor['image']) && isEmpty(guarantor['image_uri'])) {
        guarantorErrors['image'] = `${t('common.image')} ${t('common_validation.is_required')}`
      }

      if (
        guarantor_reg_sign_is_required &&
        isEmpty(guarantor['signature']) &&
        isEmpty(guarantor['signature_uri'])
      ) {
        guarantorErrors['signature'] = `${t('common.signature')} ${t(
          'common_validation.is_required'
        )}`
      }

      for (const addressField of addressFields) {
        if (isEmpty(guarantor.address[addressField])) {
          guarantorErrors.address = guarantorErrors.address || {}
          guarantorErrors.address[addressField] = `${t(`common.${addressField}`)} ${t(
            'common_validation.is_required'
          )}`
        }
      }

      return guarantorErrors
    })

    for (let index = 0; index < guarantorsErr.length; index++) {
      if (!isEmptyObject(guarantorsErr[index])) {
        validationErrors.guarantors = guarantorsErr
      }
    }
  }

  return validationErrors
}

const setFormData = (fields) => {
  const formData = new FormData()

  for (const key in fields) {
    if (key !== 'guarantors') {
      formData.append(key, fields[key])
    } else {
      fields[key].forEach((guarantor, index) => {
        for (const guarantorKey in guarantor) {
          if (guarantorKey !== 'address' && guarantorKey !== 'image') {
            formData.append(`guarantors[${index}][${guarantorKey}]`, guarantor[guarantorKey])
          } else if (guarantorKey !== 'address' && guarantorKey === 'image') {
            formData.append(`guarantors[${index}][${guarantorKey}]`, guarantor[guarantorKey])
          } else {
            for (const addressKey in guarantor[guarantorKey]) {
              formData.append(
                `guarantors[${index}][${guarantorKey}][${addressKey}]`,
                guarantor[guarantorKey][addressKey]
              )
            }
          }
        }
      })
    }
  }

  return formData
}

const loanAccFields = {
  field_id: '',
  center_id: '',
  creator_id: '',
  category_id: '',
  client_registration_id: '',
  acc_no: '',
  name: '',
  start_date: dateFormat(new Date(), 'yyyy-MM-dd'),
  duration_date: '',
  loan_given: 0,
  payable_deposit: 0,
  payable_installment: 0,
  payable_interest: 0,
  total_payable_interest: 0,
  total_payable_loan_with_interest: 0,
  loan_installment: 0,
  interest_installment: 0,
  total_payable_loan_installment: 0,
  field: '',
  center: '',
  category: '',
  client: '',
  creator: '',
  guarantors: [
    {
      name: '',
      father_name: '',
      husband_name: '',
      mother_name: '',
      nid: '',
      dob: dateFormat(new Date(), 'yyyy-MM-dd'),
      occupation: '',
      relation: '',
      gender: '',
      primary_phone: '',
      secondary_phone: '',
      image: '',
      signature: '',
      address: {
        street_address: '',
        city: '',
        word_no: '',
        post_office: '',
        police_station: '',
        district: '',
        division: ''
      }
    }
  ]
}

const loanAccErrs = {
  field_id: '',
  center_id: '',
  creator_id: '',
  category_id: '',
  acc_no: '',
  name: '',
  loan_given: '',
  payable_deposit: '',
  payable_installment: '',
  payable_interest: '',
  total_payable_interest: '',
  total_payable_loan_with_interest: '',
  loan_installment: '',
  interest_installment: '',
  guarantors: [
    {
      name: '',
      father_name: '',
      husband_name: '',
      mother_name: '',
      nid: '',
      occupation: '',
      relation: '',
      gender: '',
      primary_phone: '',
      secondary_phone: '',
      image: '',
      signature: '',
      address: {
        street_address: '',
        city: '',
        word_no: '',
        post_office: '',
        police_station: '',
        district: '',
        division: ''
      }
    }
  ]
}
