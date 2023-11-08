import { create, rawReturn } from 'mutative'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Button from '../../components/utilities/Button'
import CheckboxInputField from '../../components/utilities/CheckboxInputField'
import DatePickerInputField from '../../components/utilities/DatePickerInputField'
import ImagePreview from '../../components/utilities/ImagePreview'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import TextInputField from '../../components/utilities/TextInputField'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import UserPlus from '../../icons/UserPlus'
import xFetch from '../../utilities/xFetch'

export default function ClientRegistration() {
  const [errors, setErrors] = useState({ name: '', field: '' })
  const [loading, setLoading] = useLoadingState({})
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()
  const [clientData, setClientData] = useState({
    field_id: '',
    center_id: '',
    acc_no: '',
    name: '',
    father_name: '',
    husband_name: '',
    mother_name: '',
    nid: '',
    dob: '',
    occupation: '',
    religion: '',
    gender: '',
    primary_phone: '',
    secondary_phone: '',
    image: '',
    share: '',
    present_address: '',
    permanent_address: '',
    field: '',
    center: ''
  })

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: centers = [] } = [] } = useFetch({ action: 'centers/active' })
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
    options: centers,
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
    setClientData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field') {
          draftData.field_id = val?.id || ''
          draftData.field = val || null
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === '' || val === null
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (clientData.name === '' || clientData.field_id === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, centerForm: true })
    xFetch('centers', clientData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, centerForm: false })
        if (response?.success) {
          toast.success(response.message)
          setClientData({
            name: '',
            field_id: '',
            field: null,
            description: ''
          })
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
        setLoading({ ...loading, centerForm: false })
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
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <ImagePreview
                      label={t('common.image')}
                      src={''}
                      setChange={(val) => setChange(val, 'company_logo')}
                      error={errors?.company_logo}
                      disabled={loading?.appSettings}
                      isRequired={true}
                      style={{ width: 'max-content', margin: 'auto' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <SelectBoxField
                      label={t('common.field')}
                      config={fieldConfig}
                      isRequired={true}
                      error={errors?.field}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <SelectBoxField
                      label={t('common.center')}
                      config={centerConfig}
                      isRequired={true}
                      error={errors?.center}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.acc_no')}
                      isRequired={true}
                      defaultValue={clientData?.acc_no || ''}
                      setChange={(val) => setChange(val, 'acc_no')}
                      error={errors?.acc_no}
                      autoFocus={true}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.name')}
                      isRequired={true}
                      defaultValue={clientData?.name || ''}
                      setChange={(val) => setChange(val, 'name')}
                      error={errors?.name}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.father_name')}
                      isRequired={true}
                      defaultValue={clientData?.father_name || ''}
                      setChange={(val) => setChange(val, 'father_name')}
                      error={errors?.father_name}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.husband_name')}
                      isRequired={true}
                      defaultValue={clientData?.husband_name || ''}
                      setChange={(val) => setChange(val, 'husband_name')}
                      error={errors?.husband_name}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.mother_name')}
                      isRequired={true}
                      defaultValue={clientData?.mother_name || ''}
                      setChange={(val) => setChange(val, 'mother_name')}
                      error={errors?.mother_name}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.nid')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.nid || ''}
                      setChange={(val) => setChange(val, 'nid')}
                      error={errors?.nid}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <DatePickerInputField
                      label={t('common.dob')}
                      isRequired={true}
                      defaultValue={clientData?.dob || ''}
                      setChange={(val) => setChange(val, 'dob')}
                      error={errors?.dob}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <SelectBoxField
                      label={t('common.occupation')}
                      config={occupationConfig}
                      isRequired={true}
                      error={errors?.occupation}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <span>
                        {t('common.religion')}
                        <span className="text-danger">*</span>
                      </span>
                    </label>
                    <div
                      className="border rounded-2 px-2"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('border-color', '#8884d8', 'important')
                        }
                      }}>
                      <CheckboxInputField
                        label={t('common.saving')}
                        isRequired={true}
                        isChecked={clientData?.saving || false}
                        setChange={(e) => setChange(e.target.checked, 'saving')}
                        error={errors?.saving}
                        disabled={loading?.categoryForm}
                      />
                      <CheckboxInputField
                        label={t('common.loan')}
                        isRequired={true}
                        isChecked={clientData?.loan || false}
                        setChange={(e) => setChange(e.target.checked, 'loan')}
                        error={errors?.loan}
                        disabled={loading?.categoryForm}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <span>
                        {t('common.gender')}
                        <span className="text-danger">*</span>
                      </span>
                    </label>
                    <div
                      className="border rounded-2 px-2"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('border-color', '#8884d8', 'important')
                        }
                      }}>
                      <CheckboxInputField
                        label={t('common.saving')}
                        isRequired={true}
                        isChecked={clientData?.saving || false}
                        setChange={(e) => setChange(e.target.checked, 'saving')}
                        error={errors?.saving}
                        disabled={loading?.categoryForm}
                      />
                      <CheckboxInputField
                        label={t('common.loan')}
                        isRequired={true}
                        isChecked={clientData?.loan || false}
                        setChange={(e) => setChange(e.target.checked, 'loan')}
                        error={errors?.loan}
                        disabled={loading?.categoryForm}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.primary_phone')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.primary_phone || ''}
                      setChange={(val) => setChange(val, 'primary_phone')}
                      error={errors?.primary_phone}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.secondary_phone')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.secondary_phone || ''}
                      setChange={(val) => setChange(val, 'secondary_phone')}
                      error={errors?.secondary_phone}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.share')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.share || ''}
                      setChange={(val) => setChange(val, 'share')}
                      error={errors?.share}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.present_address')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.present_address || ''}
                      setChange={(val) => setChange(val, 'present_address')}
                      error={errors?.present_address}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.permanent_address')}
                      type="number"
                      isRequired={true}
                      defaultValue={clientData?.permanent_address || ''}
                      setChange={(val) => setChange(val, 'permanent_address')}
                      error={errors?.permanent_address}
                      disabled={loading?.clientRegistrationForm}
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer text-end">
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
