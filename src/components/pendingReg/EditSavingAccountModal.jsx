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
import SavingAccRegFormFields from '../savingAccRegistration/SavingAccRegFormFields'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function EditSavingAccountModal({ open, setOpen, accountData, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [savingAccData, setSavingAccData] = useState(accountData)
  const [errors, setErrors] = useState({})
  const { nominee_reg_sign_is_required } = useApprovalConfigsValue()

  useEffect(() => {
    setSavingAccData(accountData)
  }, [accountData])

  const onSubmit = (event) => {
    event.preventDefault()
    const validationErrors = checkRequiredFields(savingAccData, t, nominee_reg_sign_is_required)

    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(savingAccData)
    setLoading({ ...loading, SavingAccRegForm: false })

    xFetch(
      `client/registration/saving/${accountData.id}`,
      formData,
      null,
      accessToken,
      null,
      'POST',
      true
    )
      .then((response) => {
        setLoading({ ...loading, SavingAccRegForm: false })
        if (response?.success) {
          toast.success(response.message)
          setSavingAccData({})
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

  const closeModal = () => {
    setSavingAccData({})
    setOpen(false)
  }

  return (
    <>
      <ModalPro open={open} handleClose={closeModal}>
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{t('saving.edit_saving_acc')}</b>
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
                <SavingAccRegFormFields
                  formData={savingAccData}
                  setFormData={setSavingAccData}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.SavingAccRegForm}
                  editForm={true}
                />
              )}
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.SavingAccRegForm || false}
                endIcon={<Save size={20} />}
                disabled={loading?.SavingAccRegForm || false}
              />
            </div>
          </div>
        </form>
      </ModalPro>
    </>
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

  if (formFields?.nominees && Array.isArray(formFields.nominees)) {
    const nomineesErr = formFields.nominees.map((nominee, key) => {
      const nomineeErrors = {}

      for (const nomineeField of [
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
  formData.append('_method', 'PUT')

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
