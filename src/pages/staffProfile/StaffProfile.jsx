import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataState } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Button from '../../components/utilities/Button'
import ImagePreview from '../../components/utilities/ImagePreview'
import TextInputField from '../../components/utilities/TextInputField'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import User from '../../icons/User'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'
import xFetch from '../../utilities/xFetch'

export default function StaffProfile() {
  const [authData, setAuthData] = useAuthDataState()
  const { t } = useTranslation()
  const [profileImage, setProfileImage] = useState(authData.image_uri || profilePlaceholder)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useLoadingState({})
  const [profileInputs, setProfileInputs] = useState(() => ({
    name: authData.name,
    phone: authData.phone,
    image: ''
  }))

  const setChange = (val, name) => {
    if (name === 'image') {
      setProfileImage(URL.createObjectURL(val))
    }
    setProfileInputs((prevInputs) =>
      create(prevInputs, (draftInputs) => {
        draftInputs[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name !== 'phone' && name !== 'image') {
          val === ''
            ? (draftErr[name] = `${t(`common.${name}`)} is Required!`)
            : delete draftErr[name]
          return
        }

        if (name === 'phone') {
          !isNaN(val)
            ? delete draftErr.phone
            : (draftErr[name] = `${t(`common.${name}`)} is invalid!`)
        }
        if (name === 'image') {
          val.size / 1024 <= 5120
            ? delete draftErr[name]
            : (draftErr[name] = `${t(`common.${name}`)} is Max size 5MB!`)
        }
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (profileInputs.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', profileInputs.name)
    formData.append('phone', profileInputs.phone)
    formData.append('image', profileInputs.image)

    setLoading({ ...loading, staffForm: true })
    xFetch('profile-update', formData, null, authData.accessToken, null, 'POST', true).then(
      (response) => {
        setLoading({ ...loading, staffForm: false })
        if (response?.success) {
          toast.success(response.message)
          // console.log(response)
          setAuthData((prevData) =>
            create(prevData, (draftAuthData) => {
              draftAuthData.name = response?.name
              draftAuthData.phone = response?.phone
              draftAuthData.image = response?.image
              draftAuthData.image_uri = response?.image_uri
            })
          )
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
      }
    )
  }

  return (
    <>
      <section className="staff-profile">
        <Breadcrumb
          breadcrumbs={[
            { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
            { name: t('menu.staffs.Staff_Roles'), icon: <User size={16} />, active: true }
          ]}
        />

        <div className="profile-form text-center my-5">
          <div className="card">
            <form onSubmit={onSubmit}>
              <div className="card-header">
                <b className="text-uppercase">Profile</b>
              </div>
              <div className="card-body">
                <div className="card-body">
                  {errors?.message && errors?.message !== '' && (
                    <div className="alert alert-danger" role="alert">
                      <strong>{errors?.message}</strong>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.name')}
                        isRequired={true}
                        defaultValue={profileInputs.name}
                        autoFocus={true}
                        setChange={(val) => setChange(val, 'name')}
                        error={errors?.name}
                        disabled={loading?.profile}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.phone')}
                        defaultValue={profileInputs?.phone || ''}
                        setChange={(val) => setChange(val, 'phone')}
                        error={errors?.phone}
                        disabled={loading?.profile}
                      />
                    </div>
                    <div className="col-md-6 mb-3 text-start">
                      <ImagePreview
                        label={t('common.image')}
                        src={profileImage}
                        setChange={(val) => setChange(val, 'image')}
                        error={errors?.image}
                        disabled={loading?.profile}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <Button
                  name={t('common.update')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.profile || false}
                  endIcon={<Save size={20} />}
                  type="submit"
                  disabled={Object.keys(errors).length || loading?.profile}
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
