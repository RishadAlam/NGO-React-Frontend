import Menu from '../../icons/Menu'
import './topBar.scss'

export default function TopBar({ setIsSidebarMd }) {
  return (
    <>
      <div className="top-bar d-flex align-items-center">
        <span
          className="cursor-pointer menu-btn"
          onClick={() => setIsSidebarMd((prevState) => !prevState)}>
          <Menu />
        </span>
      </div>
    </>
  )
}
