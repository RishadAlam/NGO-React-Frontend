import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAppSettingsState } from '../../atoms/appSettingsAtoms'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Button from '../../components/utilities/Button'
import ImagePreview from '../../components/utilities/ImagePreview'
import TextAreaInputField from '../../components/utilities/TextAreaInputField'
import TextInputField from '../../components/utilities/TextInputField'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import Tool from '../../icons/Tool'
import xFetch from '../../utilities/xFetch'

export default function AppSettings() {
  const [appSettings, setAppSettings] = useAppSettingsState()
  const { accessToken } = useAuthDataValue()
  const { t } = useTranslation()
  const [companyLogo, setCompanyLogo] = useState(appSettings?.company_logo_uri)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useLoadingState({})
  const [inputs, setInputs] = useState(() => ({
    company_name: appSettings.company_name || '',
    company_short_name: appSettings.company_short_name || '',
    company_address: appSettings.company_address || '',
    company_logo: ''
  }))

  const setChange = (val, name) => {
    if (name === 'company_logo') {
      setCompanyLogo(URL.createObjectURL(val))
    }
    setInputs((prevInputs) =>
      create(prevInputs, (draftInputs) => {
        draftInputs[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === ''
          ? (draftErr[name] = `${t(`app_settings.${name}`)} is Required!`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      inputs.company_name === '' ||
      inputs.company_short_name === '' ||
      inputs.company_address === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('company_name', inputs.company_name)
    formData.append('company_short_name', inputs.company_short_name)
    formData.append('company_address', inputs.company_address)
    formData.append('company_logo', inputs.company_logo)
    formData.append('company_old_logo', appSettings.company_logo)
    formData.append('company_logo_uri', appSettings.company_logo_uri)

    setLoading({ ...loading, appSettings: true })
    xFetch('app-settings-update', formData, null, accessToken, null, 'POST', true)
      .then((response) => {
        setLoading({ ...loading, appSettings: false })
        if (response?.success) {
          toast.success(response.message)
          setAppSettings(response?.data)
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
      .catch((errorResponse) => {
        setLoading({ ...loading, appSettings: false })
        setErrors((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errorResponse?.errors) {
              draftErr.message = errorResponse?.message
              return
            }
            return rawReturn(errorResponse?.errors || errorResponse)
          })
        )
      })
  }

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.settings_and_privacy.app_settings'),
                  icon: <Tool size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="appSettings-form text-center mt-3">
            <div className="card">
              <form onSubmit={onSubmit}>
                <div className="card-header">
                  <b className="text-uppercase">{t('menu.settings_and_privacy.app_settings')}</b>
                </div>
                <div className="card-body">
                  {errors?.message && errors?.message !== '' && (
                    <div className="alert alert-danger" role="alert">
                      <strong>{errors?.message}</strong>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-12 mb-3 text-center">
                      <ImagePreview
                        label={t('app_settings.company_logo')}
                        src={companyLogo || ''}
                        setChange={(val) => setChange(val, 'company_logo')}
                        error={errors?.company_logo}
                        disabled={loading?.appSettings}
                        isRequired={true}
                        style={{ width: 'max-content', margin: 'auto' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('app_settings.company_name')}
                        isRequired={true}
                        defaultValue={inputs.company_name}
                        autoFocus={true}
                        setChange={(val) => setChange(val, 'company_name')}
                        error={errors?.company_name}
                        disabled={loading?.appSettings}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('app_settings.company_short_name')}
                        isRequired={true}
                        defaultValue={inputs.company_short_name}
                        setChange={(val) => setChange(val, 'company_short_name')}
                        error={errors?.company_short_name}
                        disabled={loading?.appSettings}
                      />
                    </div>
                    <div className="col-md-12 mb-3 text-start">
                      <TextAreaInputField
                        label={t('app_settings.company_address')}
                        isRequired={true}
                        defaultValue={inputs.company_address}
                        setChange={(val) => setChange(val, 'company_address')}
                        error={errors?.company_address}
                        disabled={loading?.appSettings}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Button
                    name={t('common.update')}
                    className={'btn-primary py-2 px-3'}
                    loading={loading?.appSettings || false}
                    endIcon={<Save size={20} />}
                    type="submit"
                    disabled={Object.keys(errors).length || loading?.appSettings}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
