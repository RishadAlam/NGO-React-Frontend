import Menu from '../../icons/Menu'
import DarkLangButton from '../darkLangButton/DarkLangButton'
import ProfileBox from '../profileBox/ProfileBox'
import MainSearchBox from '../searchBox/MainSearchBox'
import './topBar.scss'

export default function TopBar({ setIsSidebarMd }) {
  return (
    <>
      <div className="top-bar d-flex align-items-center">
        <div
          className="cursor-pointer menu-btn"
          onClick={() => setIsSidebarMd((prevState) => !prevState)}>
          <Menu />
        </div>
        <div className="ms-3">
          <MainSearchBox />
        </div>
        <div className="ms-auto d-flex align-items-center">
          <DarkLangButton />
          <ProfileBox />
        </div>
      </div>
    </>
  )
}
