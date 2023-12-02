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
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import xFetch from '../../utilities/xFetch'

export default function ClientRegistration() {
  const [imageUri, setImageUri] = useState(profilePlaceholder)
  const [signatureUri, setSignatureUri] = useState(SignaturePlaceholder)
  const [signatureModal, setSignatureModal] = useState(false)
  const [loading, setLoading] = useLoadingState({})
  const { accessToken } = useAuthDataValue()
  const { client_reg_sign_is_required } = useApprovalConfigsValue()
  const { t } = useTranslation()
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
    center: '',
    present_address_district: '',
    present_address_division: '',
    present_address_police_station: '',
    present_address_post_code: '',
    permanent_address_district: '',
    permanent_address_division: '',
    permanent_address_police_station: '',
    permanent_address_post_code: ''
  }
  const clientDataErrs = {
    field: '',
    center: '',
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
    present_address_street_address: '',
    present_address_city: '',
    present_address_post_office: '',
    present_address_police_station: '',
    present_address_district: '',
    present_address_division: '',
    permanent_address_street_address: '',
    permanent_address_city: '',
    permanent_address_post_office: '',
    permanent_address_police_station: '',
    permanent_address_district: '',
    permanent_address_division: ''
  }

  const [clientData, setClientData] = useState(clientDataFields)
  const [errors, setErrors] = useState(clientDataErrs)

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
      setImageUri(URL.createObjectURL(val))
    }
    setClientData((prevData) =>
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
      clientData.field_id === '' ||
      clientData.center_id === '' ||
      clientData.acc_no === '' ||
      clientData.name === '' ||
      clientData.father_name === '' ||
      clientData.mother_name === '' ||
      clientData.nid === '' ||
      clientData.dob === '' ||
      clientData.occupation === '' ||
      clientData.religion === '' ||
      clientData.gender === '' ||
      clientData.primary_phone === '' ||
      clientData.image === '' ||
      clientData.share === '' ||
      clientData.present_address.street_address === '' ||
      clientData.present_address.city === '' ||
      clientData.present_address.post_office === '' ||
      clientData.present_address.police_station === '' ||
      clientData.present_address.district === '' ||
      clientData.present_address.division === '' ||
      clientData.permanent_address.street_address === '' ||
      clientData.permanent_address.city === '' ||
      clientData.permanent_address.post_office === '' ||
      clientData.permanent_address.police_station === '' ||
      clientData.permanent_address.district === '' ||
      clientData.permanent_address.division === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    if (client_reg_sign_is_required && clientData.signature === '') {
      toast.error(`${t(`common.signature`)} ${t('common_validation.is_required')}`)
      return
    }

    const formData = new FormData()
    formData.append('field_id', clientData.field_id)
    formData.append('center_id', clientData.center_id)
    formData.append('acc_no', clientData.acc_no)
    formData.append('name', clientData.name)
    formData.append('father_name', clientData.father_name)
    formData.append('husband_name', clientData.husband_name)
    formData.append('mother_name', clientData.mother_name)
    formData.append('nid', clientData.nid)
    formData.append('dob', clientData.dob)
    formData.append('occupation', clientData.occupation)
    formData.append('religion', clientData.religion)
    formData.append('gender', clientData.gender)
    formData.append('primary_phone', clientData.primary_phone)
    formData.append('secondary_phone', clientData.secondary_phone)
    formData.append('image', clientData.image)
    formData.append('signature', clientData.signature)
    formData.append('annual_income', clientData.annual_income)
    formData.append('bank_acc_no', clientData.bank_acc_no)
    formData.append('bank_check_no', clientData.bank_check_no)
    formData.append('share', clientData.share)
    formData.append('present_address', JSON.stringify(clientData.present_address))
    formData.append('permanent_address', JSON.stringify(clientData.permanent_address))

    setLoading({ ...loading, clientRegistrationForm: true })
    xFetch('client/registration', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, clientRegistrationForm: false })
        if (response?.success) {
          toast.success(response.message)
          setClientData(clientDataFields)
          setImageUri(profilePlaceholder)
          setSignatureUri(SignaturePlaceholder)
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
                  signatureModal={signatureModal}
                  setSignatureModal={setSignatureModal}
                  signatureUri={signatureUri}
                  setSignatureUri={setSignatureUri}
                  clientData={clientData}
                  setClientData={setClientData}
                  client_reg_sign_is_required={client_reg_sign_is_required}
                  setChange={setChange}
                  errors={errors}
                  setErrors={setErrors}
                  disabled={loading.ClientRegistration}
                />
              </div>
              <div className="card-footer text-center">
                <Button
                  type="submit"
                  name={t('common.registration')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.clientRegistrationForm || false}
                  endIcon={<Save size={20} />}
                  disabled={Object.keys(errors).length || loading?.clientRegistrationForm}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
