import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Link } from 'react-router-dom'
import Key from '../../icons/Key'
import Logout from '../../icons/Logout'
import User from '../../icons/User'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'
import Button from '../util/Button'
import './profileBox.scss'

export default function ProfileBox() {
  const [isProfileVisible, setIsProfileVisible] = useState(false)

  return (
    <>
      <div className="profile position-relative">
        <div
          className="img cursor-pointer"
          onClick={() => setIsProfileVisible((prevState) => !prevState)}>
          <LazyLoadImage
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
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
                <h4>Danial Smooth</h4>
                <small>Chife Executive</small>
              </div>
            </li>
            <li className="pb-2">
              <Link to="/profile">
                <span className="me-2">
                  <User size={20} />
                </span>
                Profile
              </Link>
            </li>
            <li className="pb-3 border-bottom mb-3">
              <Link to="/change-password">
                <span className="me-2">
                  <Key size={20} />
                </span>
                Change Password
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
                    Logout
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
