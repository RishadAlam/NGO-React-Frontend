import Cookies from 'js-cookie'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthDataValue, useSetIsAuthorizedState } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { removeSessionStorage } from '../../helper/GetDataFromStorage'
import Logout from '../../icons/Logout'
import User from '../../icons/User'
import Key from '../../icons/key'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import './profileBox.scss'

export default function ProfileBox({ t }) {
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const { name, accessToken, role, image_uri } = useAuthDataValue()
  const setIsAuthorized = useSetIsAuthorizedState()
  const [loading, setLoading] = useLoadingState()
  const navigate = useNavigate()

  const logout = () => {
    setLoading({ ...loading, logout: true })

    xFetch('logout', null, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, logout: false })
        if (response.success) {
          removeSessionStorage('accessToken')
          Cookies.remove('accessToken')
          setIsAuthorized(false)
          navigate('/login')
        }
      })
      .catch((error) => {
        setLoading({ ...loading, logout: false })
        if (error?.message) {
          toast.error(error?.message)
        }
      })
  }

  return (
    <>
      <div className="profile position-relative">
        <div
          className="img cursor-pointer"
          onClick={() => setIsProfileVisible((prevState) => !prevState)}>
          <LazyLoadImage
            src={image_uri}
            width="100%"
            height="100%"
            placeholderSrc={profilePlaceholder}
            effect="blur"
            alt="Profile"
          />
        </div>
        <div className={`profile-dropdown position-absolute  ${isProfileVisible ? 'active' : ''}`}>
          <ul className="mb-0 p-3 shadow">
            <li className="pb-3 border-bottom mb-3">
              <div className="profile-info">
                <h4>{name}</h4>
                <small>{role[0]}</small>
              </div>
            </li>
            <li className="pb-2">
              <Link to="/profile" onClick={() => setIsProfileVisible(false)}>
                <span className="me-2">
                  <User size={20} />
                </span>
                {t('profile_box.profile')}
              </Link>
            </li>
            <li className="pb-3 border-bottom mb-3">
              <Link to="/change-password" onClick={() => setIsProfileVisible(false)}>
                <span className="me-2">
                  <Key size={20} />
                </span>
                {t('profile_box.change_password')}
              </Link>
            </li>
            <li>
              <Button
                type="button"
                name={
                  <p>
                    <span className="me-2">
                      <Logout size={20} />
                    </span>
                    {t('profile_box.logout')}
                  </p>
                }
                disabled={loading?.logout || false}
                loading={loading?.logout || false}
                onclick={logout}
                style={{
                  backgroundColor: 'transparent',
                  padding: '0',
                  fontSize: '14px',
                  fontWeight: '300'
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
