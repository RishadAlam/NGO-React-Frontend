import { useState } from 'react'
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

export default function NomineeFields({
  i,
  nomineeData,
  setNomineeData,
  setChange,
  errors,
  setErrors,
  disabled
}) {
  const { t } = useTranslation()
  const [signatureModal, setSignatureModal] = useState(false)

  const { data: { data: occupations = [] } = [] } = useFetch({
    action: 'client/registration/saving/nominee/occupations'
  })
  const { data: { data: relations = [] } = [] } = useFetch({
    action: 'client/registration/saving/nominee/relations'
  })

  const occupationConfig = {
    options: occupations,
    value: nomineeData?.occupation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'occupation', i)
  }
  const relationConfig = {
    options: relations,
    value: nomineeData?.relation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'relation', i)
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{`${t('common.nominee_info')} - ${tsNumbers(
            (i + 1).toString().padStart(2, '0')
          )}`}</h5>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <ImagePreview
          label={t('common.image')}
          setChange={(val) => setChange(val, 'image', i)}
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
          setChange={(val) => setChange(val, 'signature', i)}
          setErrors={setErrors}
          error={errors?.signature}
          disabled={disabled}
          isRequired={false}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.name')}
          isRequired={true}
          defaultValue={nomineeData?.name || ''}
          setChange={(val) => setChange(val, 'name', i)}
          error={errors?.name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.father_name')}
          defaultValue={nomineeData?.father_name || ''}
          setChange={(val) => setChange(val, 'father_name', i)}
          isRequired={true}
          error={errors?.father_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.husband_name')}
          defaultValue={nomineeData?.husband_name || ''}
          setChange={(val) => setChange(val, 'husband_name', i)}
          error={errors?.husband_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.mother_name')}
          isRequired={true}
          defaultValue={nomineeData?.mother_name || ''}
          setChange={(val) => setChange(val, 'mother_name', i)}
          error={errors?.mother_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.nid')}
          isRequired={true}
          defaultValue={tsNumbers(nomineeData?.nid) || ''}
          setChange={(val) => setChange(val, 'nid', i)}
          error={errors?.nid}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.dob')}
          isRequired={true}
          defaultValue={nomineeData?.dob || ''}
          setChange={(val) => setChange(val, 'dob', i)}
          error={errors?.dob}
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
          defaultValue={nomineeData?.gender || ''}
          setChange={(val) => setChange(val, 'gender', i)}
          error={errors?.gender}
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
        <SelectBoxField
          label={t('common.relation')}
          config={relationConfig}
          isRequired={true}
          error={errors?.relation}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.primary_phone')}
          isRequired={true}
          defaultValue={tsNumbers(nomineeData?.primary_phone) || ''}
          setChange={(val) => setChange(val, 'primary_phone', i)}
          error={errors?.primary_phone}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.secondary_phone')}
          defaultValue={tsNumbers(nomineeData?.secondary_phone) || ''}
          setChange={(val) => setChange(val, 'secondary_phone', i)}
          error={errors?.secondary_phone}
          disabled={disabled}
        />
      </div>
      <AddressFields
        i={i}
        addressData={nomineeData.address}
        setAddressData={setNomineeData}
        errors={(errors?.nominees && errors?.nominees[i]?.address) || {}}
        setErrors={setErrors}
        disabled={disabled}
      />
    </>
  )
}
