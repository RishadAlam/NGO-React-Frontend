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
import xFetch from '../../utilities/xFetch'
import LoanAccRegFormFields from '../loanAccRegistration/LoanAccRegFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function EditLoanAccountModal({ open, setOpen, accountData, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [loanAccData, setLoanAccData] = useState(accountData)
  const [errors, setErrors] = useState({})
  const { guarantor_reg_sign_is_required } = useApprovalConfigsValue()

  useEffect(() => {
    setLoanAccData(accountData)
  }, [accountData])

  const onSubmit = (event) => {
    event.preventDefault()
    const validationErrors = checkRequiredFields(loanAccData, t, guarantor_reg_sign_is_required)

    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(loanAccData)
    setLoading({ ...loading, LoanAccRegForm: false })

    xFetch(
      `client/registration/loan/${accountData.id}`,
      formData,
      null,
      accessToken,
      null,
      'POST',
      true
    )
      .then((response) => {
        setLoading({ ...loading, LoanAccRegForm: false })
        if (response?.success) {
          toast.success(response.message)
          setLoanAccData({})
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

  const closeModal = () => {
    setLoanAccData({})
    setOpen(false)
  }

  return (
    <>
      <ModalPro open={open} handleClose={closeModal}>
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{t('loan.edit_loan_acc')}</b>
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

              {accountData && (
                <LoanAccRegFormFields
                  formData={loanAccData}
                  setFormData={setLoanAccData}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.LoanAccRegForm}
                />
              )}
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.LoanAccRegForm || false}
                endIcon={<Save size={20} />}
                disabled={loading?.LoanAccRegForm || false}
              />
            </div>
          </div>
        </form>
      </ModalPro>
    </>
  )
}

const checkRequiredFields = (formFields, t, guarantor_reg_sign_is_required) => {
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

  if (formFields.guarantors && Array.isArray(formFields.guarantors)) {
    const guarantorsErr = formFields.guarantors.map((guarantor, key) => {
      const guarantorErrors = {}

      for (const guarantorField of [
        'id',
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
  'payable_deposit',
  'payable_installment',
  'payable_interest',
  'total_payable_interest',
  'total_payable_loan_with_interest',
  'loan_installment',
  'interest_installment',
  'total_payable_loan_installment'
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
  formData.append('_method', 'PUT')

  for (const key in fields) {
    if (key !== 'guarantors') {
      formData.append(key, fields[key])
    } else {
      fields[key].forEach((guarantor, index) => {
        for (const guarantorKey in guarantor) {
          if (guarantorKey !== 'address') {
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
