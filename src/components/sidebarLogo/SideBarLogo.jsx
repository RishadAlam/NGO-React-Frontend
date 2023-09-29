import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import logoPlaceholder from '../../resources/placeholderImg/logoPlaceholder.webp'
import './sidebarLogo.scss'

export default function SideBarLogo() {
  const { company_logo_uri, company_short_name } = useAppSettingsValue()

  return (
    <>
      <div className="logo my-3">
        <div className="img mx-auto">
          <LazyLoadImage
            src={company_logo_uri}
            width="100%"
            height="100%"
            placeholderSrc={logoPlaceholder}
            effect="blur"
            alt="logo"
          />
        </div>
        <div className="title text-center my-3">
          <h2>{company_short_name}</h2>
        </div>
      </div>
    </>
  )
}
