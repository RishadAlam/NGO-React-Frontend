import { create } from 'mutative'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import dateFormat from '../../libs/dateFormat'
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

export default function NomineeFields({
  i,
  nomineeData,
  setNomineeData,
  setChange,
  fields,
  centers,
  errors,
  setErrors,
  disabled
}) {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState(null)
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [signatureModal, setSignatureModal] = useState(false)
  const [imageUri, setImageUri] = useState(nomineeData?.image_uri || profilePlaceholder)
  const [signatureURL, setSignatureURL] = useState(
    nomineeData?.signature_uri || SignaturePlaceholder
  )

  const { data: { data: clients = [] } = [] } = useFetch({
    action: 'client/registration',
    queryParams: {
      field_id: selectedField?.id || null,
      center_id: selectedCenter?.id || null
    }
  })
  const { data: { data: occupations = [] } = [] } = useFetch({
    action: 'client/registration/saving/nominee/occupations'
  })
  const { data: { data: relations = [] } = [] } = useFetch({
    action: 'client/registration/saving/nominee/relations'
  })

  const setStateObj = (option, name) => {
    const address = option?.present_address ? JSON.parse(option?.present_address) : {}
    switch (name) {
      case 'field':
        setSelectedField(option)
        setSelectedCenter(null)
        setSelectedClient(null)
        setNomineeData((prevData) =>
          create(prevData, (draftData) => {
            draftData.nominees[i] = nomineeFields
          })
        )
        setImageUri(profilePlaceholder)
        setSignatureURL(SignaturePlaceholder)
        break

      case 'center':
        setSelectedCenter(option)
        setSelectedClient(null)
        setNomineeData((prevData) =>
          create(prevData, (draftData) => {
            draftData.nominees[i] = nomineeFields
          })
        )
        setImageUri(profilePlaceholder)
        setSignatureURL(SignaturePlaceholder)
        break

      case 'client':
        setSelectedClient(option)
        setNomineeData((prevData) =>
          create(prevData, (draftData) => {
            draftData.nominees[i].name = option?.name
            draftData.nominees[i].father_name = option?.father_name
            draftData.nominees[i].husband_name = option?.husband_name
            draftData.nominees[i].mother_name = option?.mother_name
            draftData.nominees[i].nid = option?.nid
            draftData.nominees[i].dob = option?.dob
            draftData.nominees[i].occupation = option?.occupation
            draftData.nominees[i].gender = option?.gender
            draftData.nominees[i].primary_phone = option?.primary_phone
            draftData.nominees[i].secondary_phone = option?.secondary_phone
            draftData.nominees[i].image_uri = option?.image_uri
            draftData.nominees[i].signature_uri = option?.signature_uri
            draftData.nominees[i].address.street_address = address?.street_address
            draftData.nominees[i].address.city = address?.city
            draftData.nominees[i].address.word_no = address?.word_no
            draftData.nominees[i].address.post_office = address?.post_office
            draftData.nominees[i].address.police_station = address?.police_station
            draftData.nominees[i].address.district = address?.district
            draftData.nominees[i].address.division = address?.division
          })
        )
        option?.image_uri && setImageUri(option?.image_uri)
        option?.signature_uri && setSignatureURL(option?.signature_uri)
        break

      default:
        break
    }
  }

  const fieldConfig = {
    options: fields,
    value: selectedField || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setStateObj(option, 'field'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => Number(center?.field_id) === Number(selectedField?.id))
      : [],
    value: selectedCenter || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setStateObj(option, 'center'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const clientConfig = {
    options: clients,
    value: selectedClient || null,
    getOptionLabel: (option) => tsNumbers(option.acc_no),
    onChange: (e, option) => setStateObj(option, 'client'),
    filterOptions: (options, state) =>
      state.inputValue
        ? options.filter((option) => option.acc_no.includes(tsNumbers(state.inputValue, true)))
        : options,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
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
      <div className="col-md-4 mb-3">
        <SelectBoxField label={t('common.field')} config={fieldConfig} disabled={disabled} />
      </div>
      <div className="col-md-4 mb-3">
        <SelectBoxField label={t('common.center')} config={centerConfig} disabled={disabled} />
      </div>
      <div className="col-md-4 mb-3">
        <SelectBoxField label={t('common.acc_no')} config={clientConfig} disabled={disabled} />
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
          reset={nomineeData?.image ? false : true}
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
          reset={nomineeData?.signature ? false : true}
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
        errors={(errors && errors?.address) || {}}
        setErrors={setErrors}
        disabled={disabled}
      />
    </>
  )
}

const nomineeFields = {
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
