import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ImagePreview from '../utilities/ImagePreview'
import RadioInputGroup from '../utilities/RadioInputGroup'
import SelectBoxField from '../utilities/SelectBoxField'
import SignaturePadField from '../utilities/SignaturePadField'
import TextInputField from '../utilities/TextInputField'
import AddressFields from './AddressFields'

export default function GuarantorFields({
  i,
  guarantorData,
  setGuarantorData,
  setChange,
  errors,
  setErrors,
  disabled
}) {
  const { t } = useTranslation()
  const [signatureModal, setSignatureModal] = useState(false)
  const [imageUri, setImageUri] = useState(guarantorData?.image_uri || profilePlaceholder)
  const [signatureURL, setSignatureURL] = useState(
    guarantorData?.signature_uri || SignaturePlaceholder
  )

  const { data: { data: occupations = [] } = [] } = useFetch({
    action: 'client/registration/loan/guarantor/occupations'
  })
  const { data: { data: relations = [] } = [] } = useFetch({
    action: 'client/registration/loan/guarantor/relations'
  })

  const occupationConfig = {
    options: occupations,
    value: guarantorData?.occupation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'occupation', i)
  }
  const relationConfig = {
    options: relations,
    value: guarantorData?.relation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'relation', i)
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{`${t('common.guarantor_info')} - ${tsNumbers(
            (i + 1).toString().padStart(2, '0')
          )}`}</h5>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <ImagePreview
          label={t('common.image')}
          imageUri={imageUri}
          setImageUri={setImageUri}
          setChange={(val) => setChange(val, 'image', i)}
          error={errors?.image}
          disabled={disabled}
          isRequired={true}
          style={{ width: 'max-content', margin: 'auto' }}
          reset={guarantorData?.image ? false : true}
        />
      </div>
      <div className="col-md-6 mb-3">
        <SignaturePadField
          label={t('common.signature')}
          open={signatureModal}
          setOpen={setSignatureModal}
          signatureURL={signatureURL}
          setSignatureURL={setSignatureURL}
          setChange={(val) => setChange(val, 'signature', i)}
          setErrors={setErrors}
          error={errors?.signature}
          disabled={disabled}
          isRequired={false}
          reset={guarantorData?.signature ? false : true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.name')}
          isRequired={true}
          defaultValue={guarantorData?.name || ''}
          setChange={(val) => setChange(val, 'name', i)}
          error={errors?.name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.father_name')}
          defaultValue={guarantorData?.father_name || ''}
          setChange={(val) => setChange(val, 'father_name', i)}
          isRequired={true}
          error={errors?.father_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.husband_name')}
          defaultValue={guarantorData?.husband_name || ''}
          setChange={(val) => setChange(val, 'husband_name', i)}
          error={errors?.husband_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.mother_name')}
          isRequired={true}
          defaultValue={guarantorData?.mother_name || ''}
          setChange={(val) => setChange(val, 'mother_name', i)}
          error={errors?.mother_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.nid')}
          isRequired={true}
          defaultValue={tsNumbers(guarantorData?.nid) || ''}
          setChange={(val) => setChange(val, 'nid', i)}
          error={errors?.nid}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.dob')}
          isRequired={true}
          defaultValue={guarantorData?.dob || ''}
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
          defaultValue={guarantorData?.gender || ''}
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
          defaultValue={tsNumbers(guarantorData?.primary_phone) || ''}
          setChange={(val) => setChange(val, 'primary_phone', i)}
          error={errors?.primary_phone}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.secondary_phone')}
          defaultValue={tsNumbers(guarantorData?.secondary_phone) || ''}
          setChange={(val) => setChange(val, 'secondary_phone', i)}
          error={errors?.secondary_phone}
          disabled={disabled}
        />
      </div>
      <AddressFields
        i={i}
        addressData={guarantorData.address}
        setAddressData={setGuarantorData}
        errors={(errors && errors?.address) || {}}
        setErrors={setErrors}
        disabled={disabled}
      />
    </>
  )
}