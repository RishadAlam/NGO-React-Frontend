import { create } from 'mutative'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ImagePreview from '../utilities/ImagePreview'
import RadioInputGroup from '../utilities/RadioInputGroup'
import SelectBoxField from '../utilities/SelectBoxField'
import SignaturePadField from '../utilities/SignaturePadField'
import TextInputField from '../utilities/TextInputField'
import AddressFields from './AddressFields'

function ClientRegistrationFormFields({
  clientData,
  setClientData,
  client_reg_sign_is_required,
  errors,
  setErrors,
  disabled
}) {
  const [signatureModal, setSignatureModal] = useState(false)
  const { t } = useTranslation()
  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: clientData.field_id ? { field_id: clientData.field_id } : null
  })
  const { data: { data: occupations = [] } = [] } = useFetch({
    action: 'client/registration/occupations'
  })

  const fieldConfig = {
    options: fields,
    value: clientData?.field || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'field_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => center?.field_id === clientData.field_id)
      : [],
    value: clientData?.center || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'center_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const occupationConfig = {
    options: occupations,
    value: clientData?.occupation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'occupation')
  }

  const setChange = (val, name) => {
    if (
      name === 'acc_no' ||
      name === 'nid' ||
      name === 'primary_phone' ||
      name === 'secondary_phone' ||
      name === 'annual_income' ||
      name === 'bank_acc_no' ||
      name === 'bank_check_no' ||
      name === 'share'
    ) {
      val = tsNumbers(val, true)
    }
    setClientData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field_id') {
          draftData.field_id = val?.id || ''
          draftData.field = val || null
          draftData.center_id = ''
          draftData.center = ''
          return
        }
        if (name === 'center_id') {
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
            name === 'share' ||
            name === 'annual_income' ||
            name === 'bank_acc_no' ||
            name === 'bank_check_no') &&
          !Number(val) &&
          !isEmpty(val)
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
          isEmpty(val)
            ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
            : delete draftErr[name]
        } else if (isEmpty(val)) {
          delete draftErr[name]
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

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <ImagePreview
          label={t('common.image')}
          setChange={(val) => setChange(val, 'image')}
          error={errors?.image}
          disabled={disabled}
          isRequired={true}
          style={{ width: 'max-content', margin: 'auto' }}
          reset={clientData?.image ? false : true}
        />
      </div>
      <div className="col-md-6 mb-3">
        <SignaturePadField
          label={t('common.signature')}
          open={signatureModal}
          setOpen={setSignatureModal}
          setChange={(val) => setChange(val, 'signature')}
          error={errors?.signature}
          disabled={disabled}
          isRequired={client_reg_sign_is_required}
          reset={clientData?.image ? false : true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.field')}
          config={fieldConfig}
          isRequired={true}
          error={errors?.field_id}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.center')}
          config={centerConfig}
          isRequired={true}
          error={errors?.center_id}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.acc_no')}
          isRequired={true}
          defaultValue={tsNumbers(clientData?.acc_no) || ''}
          setChange={(val) => setChange(val, 'acc_no')}
          error={errors?.acc_no}
          autoFocus={true}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.name')}
          isRequired={true}
          defaultValue={clientData?.name || ''}
          setChange={(val) => setChange(val, 'name')}
          error={errors?.name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.father_name')}
          defaultValue={clientData?.father_name || ''}
          setChange={(val) => setChange(val, 'father_name')}
          isRequired={true}
          error={errors?.father_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.husband_name')}
          defaultValue={clientData?.husband_name || ''}
          setChange={(val) => setChange(val, 'husband_name')}
          error={errors?.husband_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.mother_name')}
          isRequired={true}
          defaultValue={clientData?.mother_name || ''}
          setChange={(val) => setChange(val, 'mother_name')}
          error={errors?.mother_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.nid')}
          isRequired={true}
          defaultValue={tsNumbers(clientData?.nid) || ''}
          setChange={(val) => setChange(val, 'nid')}
          error={errors?.nid}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.dob')}
          isRequired={true}
          defaultValue={clientData?.dob || ''}
          setChange={(val) => setChange(val, 'dob')}
          error={errors?.dob}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.occupation')}
          config={occupationConfig}
          isRequired={true}
          error={errors?.occupation}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <RadioInputGroup
          label={t('common.religion')}
          options={[
            { label: t('common.islam'), value: 'islam' },
            { label: t('common.hindu'), value: 'hindu' },
            { label: t('common.christian'), value: 'christian' },
            { label: t('common.Buddhist'), value: 'Buddhist' },
            { label: t('common.others'), value: 'others' }
          ]}
          isRequired={true}
          defaultValue={clientData?.religion || ''}
          setChange={(val) => setChange(val, 'religion')}
          error={errors?.religion}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <RadioInputGroup
          label={t('common.gender')}
          options={[
            { label: t('common.male'), value: 'male' },
            { label: t('common.female'), value: 'female' },
            { label: t('common.others'), value: 'others' }
          ]}
          isRequired={true}
          defaultValue={clientData?.gender || ''}
          setChange={(val) => setChange(val, 'gender')}
          error={errors?.gender}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.primary_phone')}
          isRequired={true}
          defaultValue={tsNumbers(clientData?.primary_phone) || ''}
          setChange={(val) => setChange(val, 'primary_phone')}
          error={errors?.primary_phone}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.secondary_phone')}
          defaultValue={tsNumbers(clientData?.secondary_phone) || ''}
          setChange={(val) => setChange(val, 'secondary_phone')}
          error={errors?.secondary_phone}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.annual_income')}
          defaultValue={tsNumbers(clientData?.annual_income) || ''}
          setChange={(val) => setChange(val, 'annual_income')}
          error={errors?.annual_income}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.bank_acc_no')}
          defaultValue={tsNumbers(clientData?.bank_acc_no) || ''}
          setChange={(val) => setChange(val, 'bank_acc_no')}
          error={errors?.bank_acc_no}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.bank_check_no')}
          defaultValue={tsNumbers(clientData?.bank_check_no) || ''}
          setChange={(val) => setChange(val, 'bank_check_no')}
          error={errors?.bank_check_no}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.share')}
          isRequired={true}
          defaultValue={tsNumbers(clientData?.share) || ''}
          setChange={(val) => setChange(val, 'share')}
          error={errors?.share}
          disabled={disabled}
        />
      </div>
      <AddressFields
        clientData={clientData}
        setClientData={setClientData}
        errors={errors}
        setErrors={setErrors}
        disabled={disabled}
      />
    </div>
  )
}

export default memo(ClientRegistrationFormFields)
