import { useTranslation } from 'react-i18next'
import Menu from '../../icons/Menu'
import DarkLangButton from '../darkLangButton/DarkLangButton'
import ProfileBox from '../profileBox/ProfileBox'
import MainSearchBox from '../searchBox/MainSearchBox'
import './topBar.scss'

export default function TopBar({ setIsSidebarMd }) {
  const { t } = useTranslation()
  return (
    <>
      <div className="top-bar d-flex align-items-center">
        <div
          className="cursor-pointer menu-btn"
          onClick={() => setIsSidebarMd((prevState) => !prevState)}>
          <Menu />
        </div>
        <div className="ms-3">
          <MainSearchBox t={t} />
        </div>
        <div className="ms-auto d-flex align-items-center">
          <DarkLangButton />
          <ProfileBox t={t} />
        </div>
      </div>
    </>
  )
}
