import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'
import TextAreaInputField from '../utilities/TextAreaInputField'
import TextInputField from '../utilities/TextInputField'

export default function SavingCollectionModal({
  open,
  setOpen,
  collectionData,
  mutate,
  isRegular = true
}) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [errors, setErrors] = useState({})
  const [collection, setCollection] = useState(collectionData)
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  useEffect(() => {
    setCollection(collectionData)
  }, [collectionData])

  const accountSelectBoxConfig = {
    options: accounts,
    value: accounts.filter((account) => account.id === collection?.account_id)[0] || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => setChange(option, 'account_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!isRegular && !collection.newCollection) closeModal()

    const validationErrors = checkRequiredFields(collection, t)
    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors)
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = setFormData(collection, isRegular)
    setLoading({ ...loading, collectionForm: true })
    const endpoint = collection.newCollection
      ? 'collection/saving'
      : `collection/saving/${collection.collection_id}`

    xFetch(endpoint, formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, collectionForm: false })
        if (response?.success) {
          toast.success(response.message)
          setCollection(collectionData)
          setErrors({})
          mutate()
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
        setLoading({ ...loading, collectionForm: false })
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

  const setChange = (val, name) => {
    if (name === 'deposit' || name === 'installment') {
      val = tsNumbers(val, true)
    }
    setCollection((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'account_id') {
          draftData[name] = val.id
          return
        }
        if (name === 'installment') {
          draftData.deposit = draftData.payable_deposit * val
        }
        draftData[name] = val
      })
    )
    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        if ((name === 'deposit' || name === 'installment') && (!Number(val) || isEmpty(val))) {
          draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_invalid')}`
          return
        } else if (name === 'account_id' && isEmpty(val)) {
          draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_invalid')}`
          return
        }
        delete draftErr[name]
      })
    )
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <>
      <ModalPro open={open} handleClose={closeModal}>
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{t('menu.collection.Saving_Collection')}</b>
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={collection?.name || ''}
                    error={errors?.name}
                    autoFocus={false}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.account')}
                    config={accountSelectBoxConfig}
                    isRequired={true}
                    error={errors?.account}
                    disabled={loading?.loanApproval}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.installment')}
                    isRequired={true}
                    defaultValue={tsNumbers(collection?.installment) || ''}
                    setChange={(val) => setChange(val, 'installment')}
                    error={errors?.installment}
                    autoFocus={true}
                    disabled={loading?.collectionForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.deposit')}
                    isRequired={true}
                    defaultValue={tsNumbers(collection?.deposit) || ''}
                    setChange={(val) => setChange(val, 'deposit')}
                    error={errors?.deposit}
                    autoFocus={true}
                    disabled={loading?.collectionForm}
                  />
                </div>
              </div>
              <div className="col-md-12 mb-3 text-start">
                <TextAreaInputField
                  label={t('common.description')}
                  defaultValue={collection?.description}
                  setChange={(val) => setChange(val, 'description')}
                  error={errors?.description}
                  disabled={loading?.collectionForm}
                />
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.collectionForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(errors).length || loading?.collectionForm || false}
              />
            </div>
          </div>
        </form>
      </ModalPro>
    </>
  )
}

const checkRequiredFields = (formFields, t) => {
  const validationErrors = {}

  for (const fieldName of fieldValidations) {
    if (isEmpty(formFields[fieldName])) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_required'
      )}`
    } else if (
      (fieldName === 'deposit' || fieldName === 'installment') &&
      !Number(formFields[fieldName])
    ) {
      validationErrors[fieldName] = `${t(`common.${fieldName}`)} ${t(
        'common_validation.is_invalid'
      )}`
    }
  }

  return validationErrors
}

const setFormData = (fields, isRegular) => {
  const formData = new FormData()
  if (!fields?.newCollection || !isRegular) {
    formData.append('_method', 'PUT')
  }

  for (const key in fields) {
    if (
      key !== 'newCollection' &&
      key !== 'collection_id' &&
      key !== 'name' &&
      key !== 'payable_deposit'
    ) {
      formData.append(key, fields[key])
    }
  }

  return formData
}

const fieldValidations = [
  'newCollection',
  'saving_account_id',
  'field_id',
  'center_id',
  'category_id',
  'client_registration_id',
  'account_id',
  'acc_no',
  'installment',
  'deposit'
]
