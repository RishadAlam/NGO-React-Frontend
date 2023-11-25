import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import profilePlaceholder from '../../resources/img/UserPlaceholder.jpg'
import ImagePreview from '../utilities/ImagePreview'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'
import SavingFields from './SavingFields'

export default function SavingAccRegFormFields({
  imageUri,
  signatureModal,
  setSignatureModal,
  signatureUri,
  setSignatureUri,
  formData,
  setFormData,
  errors,
  setErrors,
  disabled
}) {
  const { id, permissions } = useAuthDataValue()
  const { t } = useTranslation()
  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const { data: { data: categories = [] } = [] } = useFetch({ action: 'categories/active' })
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: formData.field_id ? { field_id: formData.field_id } : null
  })
  const { data: { data: clients = [] } = [] } = useFetch({
    action: 'client/registration',
    queryParams: {
      form: true,
      field_id: formData?.field_id || null,
      center_id: formData?.center_id || null,
      category_id: formData?.category_id || null
    }
  })

  const creatorConfig = {
    options: permissions?.saving_acc_creator_selection
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: formData?.creator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const fieldConfig = {
    options: fields,
    value: formData?.field || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'field'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const categoryConfig = {
    options: categories,
    value: formData?.category || null,
    getOptionLabel: (option) =>
      option.is_default ? t(`category.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 'category'),
    groupBy: (option) => option.group,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => center?.field_id === formData.field_id)
      : [],
    value: formData?.center || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'center'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const clientConfig = {
    options: clients,
    value: formData.client || null,
    getOptionLabel: (option) => tsNumbers(option.acc_no),
    onChange: (e, option) => setChange(option, 'client'),
    filterOptions: (options, state) =>
      state.inputValue
        ? options.filter((option) => option.acc_no.includes(tsNumbers(state.inputValue, true)))
        : options,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const setChange = (val, name) => {
    if (name === 'image') {
      //   setImageUri(URL.createObjectURL(val))
    }
    setFormData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field') {
          draftData.field_id = val?.id || ''
          draftData.field = val || null
          draftData.center_id = ''
          draftData.center = ''
          draftData.client_registration_id = ''
          draftData.acc_no = ''
          draftData.name = ''
          draftData.client = ''
          return
        }
        if (name === 'center') {
          draftData.center_id = val?.id || ''
          draftData.center = val || null
          draftData.client_registration_id = ''
          draftData.acc_no = ''
          draftData.name = ''
          draftData.client = ''
          return
        }
        if (name === 'category') {
          draftData.category_id = val?.id || ''
          draftData.category = val || null
          return
        }
        if (name === 'client') {
          draftData.client_registration_id = val?.id || ''
          draftData.acc_no = val?.acc_no || ''
          draftData.name = val?.name || ''
          draftData.image_uri = val?.image_uri || ''
          draftData.client = val || null
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === '' || val === null
          ? (draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_required')}`)
          : delete draftErr[name]
      })
    )
  }

  console.log(formData)

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row align-items-center">
          <div className="col-md-5 mb-3">
            <ImagePreview
              label={t('common.image')}
              src={formData?.client?.image_uri || profilePlaceholder}
              setChange={false}
              error={false}
              disabled={true}
              style={{ width: 'max-content', margin: 'auto' }}
            />
          </div>
          <div className="col-md-7">
            <div className="row">
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.field')}
                  config={fieldConfig}
                  isRequired={true}
                  error={errors?.field}
                  disabled={disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.center')}
                  config={centerConfig}
                  isRequired={true}
                  error={errors?.center}
                  disabled={disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.category')}
                  config={categoryConfig}
                  isRequired={true}
                  error={errors?.category}
                  disabled={disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.creator')}
                  config={creatorConfig}
                  isRequired={true}
                  error={errors?.creator}
                  disabled={disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.acc_no')}
                  config={clientConfig}
                  isRequired={true}
                  error={errors?.client}
                  disabled={disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <TextInputField
                  label={t('common.name')}
                  isRequired={true}
                  defaultValue={formData?.name || ''}
                  setChange={(val) => setChange(val, 'name')}
                  error={errors?.name}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SavingFields
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        disabled={disabled}
      />
      {/* <AddressFields
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        disabled={disabled}
      /> */}
    </div>
  )
}
