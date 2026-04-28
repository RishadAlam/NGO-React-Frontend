import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import logoPlaceholder from '../../resources/placeholderImg/logoPlaceholder.webp'
import './sidebarLogo.scss'

const FALLBACK_LOGO = '/logo.svg'

export default function SideBarLogo() {
  const { company_logo_uri, company_short_name } = useAppSettingsValue()
  const [imageSrc, setImageSrc] = useState(
    company_logo_uri && company_logo_uri.trim() ? company_logo_uri : FALLBACK_LOGO
  )

  const handleImageError = () => {
    setImageSrc(FALLBACK_LOGO)
  }

  return (
    <>
      <div className="logo my-3">
        <div className="img mx-auto">
          <LazyLoadImage
            src={imageSrc}
            width="100%"
            height="100%"
            placeholderSrc={logoPlaceholder}
            effect="blur"
            alt="logo"
            onError={handleImageError}
          />
        </div>
        <div className="title text-center my-3">
          <h2>{company_short_name}</h2>
        </div>
      </div>
    </>
  )
}
