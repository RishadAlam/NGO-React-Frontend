import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import logo from '../../resources/img/logo.png'
import logoPlaceholder from '../../resources/placeholderImg/logoPlaceholder.webp'
import './sidebarLogo.scss'

export default function SideBarLogo() {
  return (
    <>
      <div className="logo my-3">
        <div className="img mx-auto">
          <LazyLoadImage
            src={logo}
            width="100%"
            height="100%"
            placeholderSrc={logoPlaceholder}
            effect="blur"
            alt="logo"
          />
        </div>
        <div className="title text-center my-3">
          <h2>Jonokollan kormojibi Co-Oparetive Society LTD</h2>
        </div>
      </div>
    </>
  )
}
