import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Button from '../../components/utilities/Button'
import TextInputField from '../../components/utilities/TextInputField'
import Camera from '../../icons/Camera'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import User from '../../icons/User'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'

export default function StaffProfile() {
  const data = useAuthDataValue()
  const { t } = useTranslation()
  const [profileImage, setProfileImage] = useState(data.image_uri || profilePlaceholder)
  const [profileInputs, setProfileInputs] = useState(() => ({
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone
  }))

  const getImagePreview = (event) => {
    // var image = URL.createObjectURL(event.target.files[0])
    setProfileImage(URL.createObjectURL(event.target.files[0]))
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
            <div className="card-header">
              <b className="text-uppercase">Profile</b>
            </div>
            <div className="card-body">
              <div className="card-body">
                {/* {error?.message && error?.message !== '' && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{error?.message}</strong>
                  </div>
                )} */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.name')}
                      isRequired={true}
                      defaultValue={profileInputs.name}
                      autoFocus={true}
                      //   setChange={(val) => setChange(val, 'name')}
                      //   error={error?.name}
                      //   disabled={loading?.staffForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.email')}
                      type="email"
                      isRequired={true}
                      defaultValue={profileInputs?.email || ''}
                      //   setChange={(val) => setChange(val, 'email')}
                      //   error={error?.email}
                      //   disabled={loading?.staffForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={t('common.phone')}
                      defaultValue={profileInputs?.phone || ''}
                      //   setChange={(val) => setChange(val, 'phone')}
                      //   error={error?.phone}
                      //   disabled={loading?.staffForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3 text-start">
                    <label className="form-label mb-3">Image</label>
                    <div
                      className="border border-secondary shadow rounded-4 p-3"
                      style={{ width: 'max-content' }}>
                      <div className="img" style={{ width: '250px', height: '250px' }}>
                        <img
                          className="rounded-2"
                          alt="image"
                          src={profileImage}
                          style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="mx-auto position-relative mt-3">
                        <label htmlFor="image" className="btn btn-primary form-control">
                          <Camera />
                        </label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          className="top-0 start-0 position-absolute opacity-0 cursor-pointer"
                          onChange={getImagePreview}
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Button
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                // loading={loading?.roleName || false}
                endIcon={<Save size={20} />}
                type="submit"
                // disabled={Object.keys(error).length || loading?.roleName}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
