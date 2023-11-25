import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingAccRegFormFields from '../../components/savingAccRegistration/SavingAccRegFormFields'
import Button from '../../components/utilities/Button'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'

export default function SavingAccReg() {
  const [loading, setLoading] = useLoadingState({})
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const savingAccFields = {
    field_id: '',
    center_id: '',
    creator_id: '',
    category_id: '',
    client_registration_id: '',
    acc_no: '',
    name: '',
    start_date: dateFormat(new Date(), 'yyyy-MM-dd'),
    duration_date: '',
    payable_deposit: '',
    payable_installment: '',
    payable_interest: '',
    total_deposit_without_interest: '',
    total_deposit_with_interest: '',
    field: '',
    center: '',
    category: '',
    client: '',
    creator: '',
    nominees: [
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
          post_code: '',
          police_station: '',
          district: '',
          division: ''
        }
      }
    ]
  }
  const savingAccErrs = {
    field_id: '',
    center_id: '',
    creator_id: '',
    category_id: '',
    client_registration_id: '',
    acc_no: '',
    name: '',
    image_uri: '',
    start_date: '',
    duration_date: '',
    payable_deposit: '',
    payable_installment: '',
    payable_interest: '',
    total_deposit_without_interest: '',
    total_deposit_with_interest: '',
    field: '',
    center: '',
    category: '',
    client: '',
    creator: '',
    nominees: [
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
          post_code: '',
          police_station: '',
          district: '',
          division: ''
        }
      }
    ]
  }

  const [savingAccData, setSavingAccData] = useState(savingAccFields)
  const [errors, setErrors] = useState(savingAccErrs)

  const setChange = (val, name) => {
    if (
      name === 'acc_no' ||
      name === 'nid' ||
      name === 'primary_phone' ||
      name === 'secondary_phone' ||
      name === 'annual_income' ||
      name === 'bank_acc_no' ||
      name === 'bank_check_no'
    ) {
      val = tsNumbers(val, true)
    }
    if (name === 'image') {
      //   setImageUri(URL.createObjectURL(val))
    }
    setSavingAccData((prevData) =>
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
          (name === 'nid' ||
            name === 'primary_phone' ||
            name === 'secondary_phone' ||
            name === 'annual_income' ||
            name === 'bank_acc_no' ||
            name === 'bank_check_no') &&
          !Number(val)
        ) {
          draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_invalid')}`
          return
        }
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
          val.length !== 11 || !String(val).startsWith('01')
            ? (draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_invalid')}`)
            : delete draftErr[name]
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
      savingAccData.field_id === '' ||
      savingAccData.center_id === '' ||
      savingAccData.acc_no === '' ||
      savingAccData.name === '' ||
      savingAccData.father_name === '' ||
      savingAccData.mother_name === '' ||
      savingAccData.nid === '' ||
      savingAccData.dob === '' ||
      savingAccData.occupation === '' ||
      savingAccData.religion === '' ||
      savingAccData.gender === '' ||
      savingAccData.primary_phone === '' ||
      savingAccData.image === '' ||
      savingAccData.share === '' ||
      savingAccData.present_address.street_address === '' ||
      savingAccData.present_address.city === '' ||
      savingAccData.present_address.post_office === '' ||
      savingAccData.present_address.police_station === '' ||
      savingAccData.present_address.district === '' ||
      savingAccData.present_address.division === '' ||
      savingAccData.permanent_address.street_address === '' ||
      savingAccData.permanent_address.city === '' ||
      savingAccData.permanent_address.post_office === '' ||
      savingAccData.permanent_address.police_station === '' ||
      savingAccData.permanent_address.district === '' ||
      savingAccData.permanent_address.division === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    // if (client_reg_sign_is_required && savingAccData.signature === '') {
    //   toast.error(`${t(`common.signature`)} ${t('common_validation.is_required')}`)
    //   return
    // }

    const formData = new FormData()
    formData.append('field_id', savingAccData.field_id)
    formData.append('center_id', savingAccData.center_id)
    formData.append('acc_no', savingAccData.acc_no)
    formData.append('name', savingAccData.name)
    formData.append('father_name', savingAccData.father_name)
    formData.append('husband_name', savingAccData.husband_name)
    formData.append('mother_name', savingAccData.mother_name)
    formData.append('nid', savingAccData.nid)
    formData.append('dob', savingAccData.dob)
    formData.append('occupation', savingAccData.occupation)
    formData.append('religion', savingAccData.religion)
    formData.append('gender', savingAccData.gender)
    formData.append('primary_phone', savingAccData.primary_phone)
    formData.append('secondary_phone', savingAccData.secondary_phone)
    formData.append('image', savingAccData.image)
    formData.append('signature', savingAccData.signature)
    formData.append('annual_income', savingAccData.annual_income)
    formData.append('bank_acc_no', savingAccData.bank_acc_no)
    formData.append('bank_check_no', savingAccData.bank_check_no)
    formData.append('share', savingAccData.share)
    formData.append('present_address', JSON.stringify(savingAccData.present_address))
    formData.append('permanent_address', JSON.stringify(savingAccData.permanent_address))

    setLoading({ ...loading, SavingAccRegForm: true })
    xFetch('client/registration', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, SavingAccRegForm: false })
        if (response?.success) {
          toast.success(response.message)
          setSavingAccData(savingAccFields)
          //   setImageUri(profilePlaceholder)
          //   setSignatureUri(SignaturePlaceholder)
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
                  imageUri=""
                  signatureModal=""
                  setSignatureModal={null}
                  signatureUri={null}
                  setSignatureUri={null}
                  formData={savingAccData}
                  setFormData={setSavingAccData}
                  setChange={setChange}
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
                  disabled={Object.keys(errors).length || loading?.SavingAccRegForm}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
