import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Link } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Logout from '../../icons/Logout'
import User from '../../icons/User'
import Key from '../../icons/key'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'
import Button from '../utilities/Button'
import './profileBox.scss'

export default function ProfileBox({ t }) {
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const { name, role, image_uri } = useAuthDataValue()

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
              <Link to="/profile">
                <span className="me-2">
                  <User size={20} />
                </span>
                {t('profile_box.profile')}
              </Link>
            </li>
            <li className="pb-3 border-bottom mb-3">
              <Link to="/change-password">
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
                disabled={false}
                loading={false}
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
