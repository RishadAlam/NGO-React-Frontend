import React from 'react'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ImagePreview from '../utilities/ImagePreview'
import RadioInputGroup from '../utilities/RadioInputGroup'
import SelectBoxField from '../utilities/SelectBoxField'
import SignaturePadField from '../utilities/SignaturePadField'
import TextInputField from '../utilities/TextInputField'
import AddressFields from './AddressFields'

export default function ClientRegistrationFormFields({
  imageUri,
  signatureModal,
  setSignatureModal,
  signatureUri,
  setSignatureUri,
  clientData,
  setClientData,
  client_reg_sign_is_required,
  setChange,
  errors,
  setErrors,
  disabled
}) {
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
    onChange: (e, option) => setChange(option, 'field'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => center?.field_id === clientData.field_id)
      : [],
    value: clientData?.center || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'center'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const occupationConfig = {
    options: occupations,
    value: clientData?.occupation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'occupation')
  }

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <ImagePreview
          label={t('common.image')}
          src={imageUri}
          setChange={(val) => setChange(val, 'image')}
          error={errors?.image}
          disabled={disabled}
          isRequired={true}
          style={{ width: 'max-content', margin: 'auto' }}
        />
      </div>
      <div className="col-md-6 mb-3">
        <SignaturePadField
          label={t('common.signature')}
          open={signatureModal}
          setOpen={setSignatureModal}
          imageURL={signatureUri}
          setImageURL={setSignatureUri}
          setChange={(val) => setChange(val, 'signature')}
          error={errors?.signature}
          disabled={disabled}
          isRequired={client_reg_sign_is_required}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.field')}
          config={fieldConfig}
          isRequired={true}
          error={errors?.field}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.center')}
          config={centerConfig}
          isRequired={true}
          error={errors?.center}
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
