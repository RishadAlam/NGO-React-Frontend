import { create } from 'mutative'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import ImagePreview from '../utilities/ImagePreview'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'
import Nominees from './Nominees'
import SavingFields from './SavingFields'

function SavingAccRegFormFields({
  formData,
  setFormData,
  errors,
  setErrors,
  disabled,
  editForm = false
}) {
  const { id, permissions } = useAuthDataValue()
  const { t } = useTranslation()
  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const { data: { data: categories = [] } = [] } = useFetch({
    action: `categories/active?saving=${true}`
  })
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: formData.field_id ? { field_id: formData.field_id } : null
  })
  const { data: { data: clients = [] } = [] } = useFetch({
    action: `client/registration/accounts/${formData?.field_id || ''}/${formData?.center_id || ''}`
  })

  const creatorConfig = {
    options: !permissions.includes('saving_acc_creator_selection')
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: formData?.creator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'creator_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const fieldConfig = {
    options: fields,
    value: formData?.field || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'field_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const categoryConfig = {
    options: categories.sort((a, b) => (a.group > b.group ? 1 : -1)),
    value: formData?.category || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'category.default.', option.name),
    onChange: (e, option) => setChange(option, 'category_id'),
    groupBy: (option) => option.group,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => Number(center?.field_id) === Number(formData.field_id))
      : [],
    value: formData?.center || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'center_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const clientConfig = {
    options: clients,
    value: formData.client || null,
    getOptionLabel: (option) => tsNumbers(option.acc_no),
    onChange: (e, option) => setChange(option, 'acc_no'),
    filterOptions: (options, state) =>
      state.inputValue
        ? options.filter((option) => option.acc_no.includes(tsNumbers(state.inputValue, true)))
        : options,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const setChange = (val, name) => {
    setFormData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field_id') {
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
        if (name === 'center_id') {
          draftData.center_id = val?.id || ''
          draftData.center = val || null
          draftData.client_registration_id = ''
          draftData.acc_no = ''
          draftData.name = ''
          draftData.client = ''
          return
        }
        if (name === 'category_id') {
          draftData.category_id = val?.id || ''
          draftData.category = val || null
          return
        }
        if (name === 'acc_no') {
          draftData.client_registration_id = val?.id || ''
          draftData.acc_no = val?.acc_no || ''
          draftData.name = val?.name || ''
          draftData.client = val || null
          return
        }
        if (name === 'creator_id') {
          draftData.creator_id = val?.id || ''
          draftData.creator = val || null
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        isEmpty(val)
          ? (draftErr[name] = `${t(`common.${name}`)} ${t('common_validation.is_required')}`)
          : delete draftErr[name]
      })
    )
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row align-items-center">
          <div className="col-md-5 mb-3">
            <ImagePreview
              label={t('common.image')}
              imageUri={formData?.client?.image_uri}
              error={errors?.acc_no}
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
                  error={errors?.field_id}
                  disabled={editForm || disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.center')}
                  config={centerConfig}
                  isRequired={true}
                  error={errors?.center_id}
                  disabled={editForm || disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.category')}
                  config={categoryConfig}
                  isRequired={true}
                  error={errors?.category_id}
                  disabled={editForm || disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.creator')}
                  config={creatorConfig}
                  isRequired={true}
                  error={errors?.creator_id}
                  disabled={editForm || disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <SelectBoxField
                  label={t('common.acc_no')}
                  config={clientConfig}
                  isRequired={true}
                  error={errors?.acc_no}
                  disabled={editForm || disabled}
                />
              </div>
              <div className="col-md-12 col-xl-6 mb-3">
                <TextInputField
                  label={t('common.name')}
                  isRequired={true}
                  defaultValue={formData?.name || ''}
                  setChange={(val) => setChange(val, 'name')}
                  error={errors?.acc_no}
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
      <Nominees
        formData={formData}
        setFormData={setFormData}
        fields={fields}
        centers={centers}
        errors={errors}
        setErrors={setErrors}
        disabled={disabled}
        editForm={editForm}
      />
    </div>
  )
}

export default memo(SavingAccRegFormFields)
