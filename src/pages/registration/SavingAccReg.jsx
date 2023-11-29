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
import xFetch from '../../utilities/xFetch'

export default function SavingAccReg() {
  const [loading, setLoading] = useLoadingState({})
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const [savingAccData, setSavingAccData] = useState(savingAccFields)
  const [errors, setErrors] = useState(savingAccErrs)

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      savingAccData.field_id === '' ||
      savingAccData.center_id === '' ||
      savingAccData.category_id === '' ||
      savingAccData.creator_id === '' ||
      savingAccData.acc_no === '' ||
      savingAccData.client_registration_id === '' ||
      savingAccData.start_date === '' ||
      savingAccData.duration_date === '' ||
      savingAccData.payable_deposit === '' ||
      savingAccData.payable_installment === '' ||
      savingAccData.payable_interest === '' ||
      savingAccData.total_deposit_without_interest === '' ||
      savingAccData.total_deposit_with_interest === '' ||
      savingAccData.nominees === ''
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
    formData.append('category_id', savingAccData.category_id)
    formData.append('client_registration_id', savingAccData.client_registration_id)
    formData.append('acc_no', savingAccData.acc_no)
    formData.append('start_date', savingAccData.start_date)
    formData.append('duration_date', savingAccData.duration_date)
    formData.append('payable_installment', savingAccData.payable_installment)
    formData.append('payable_deposit', savingAccData.payable_deposit)
    formData.append('payable_interest', savingAccData.payable_interest)
    formData.append('total_deposit_without_interest', savingAccData.total_deposit_without_interest)
    formData.append('total_deposit_with_interest', savingAccData.total_deposit_with_interest)
    formData.append('creator_id', savingAccData.creator_id)
    // for (let i = 0; i < savingAccData.nominees.length; i++) {
    //   formData.append('nominee_images[]', savingAccData.nominees[i].image)
    // }
    savingAccData.nominees.forEach((nominee, index) => {
      for (const key in nominee) {
        if (key !== 'name') {
          if (key !== 'address' && key !== 'image') {
            formData.append(`nominees[${index}][${key}]`, nominee[key])
          } else if (key !== 'address' && key === 'image') {
            formData.append(`nominees[${index}][${key}]`, nominee[key], nominee[key].name)
          } else {
            for (const addressKey in nominee[key]) {
              formData.append(`nominees[${index}][${key}][${addressKey}]`, nominee[key][addressKey])
            }
          }
        }
      }
    })

    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1])
    // }

    setLoading({ ...loading, SavingAccRegForm: true })
    xFetch('client/registration/saving', formData, null, accessToken, null, 'POST', true)
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
            // if (response?.errors && typeof response?.errors === 'object') {
            //   for (const errKey in response?.errors) {
            //     const keyArr = errKey.split('.')
            //     if (keyArr?.length) {
            //     } else {
            //       draftErr[keyArr] = response?.errors[keyArr]
            //     }
            //   }
            // }
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
                  // disabled={Object.keys(errors).length || loading?.SavingAccRegForm}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

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
        police_station: '',
        district: '',
        division: ''
      }
    }
  ]
}
const savingAccErrs = {
  field: '',
  center: '',
  creator: '',
  category: '',
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
