import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavDropdown from './NavDropdown'
import NavItemLink from './NavItemLink'

function Nav({ m, setMobileMenuClosed, dropDowns, setDropDowns, toggleSideMenu, sectionId }) {
  const location = useLocation()
  const subMenuItems = m.subMenu?.filter((subMenu) => subMenu.view) || []
  const dropdownId = `${sectionId}d${m.id}`
  const isDropDownActive = subMenuItems.some((subMenu) => subMenu.path === location.pathname)

  useEffect(() => {
    if (isDropDownActive) {
      setDropDowns((prevDropDowns) => ({
        ...prevDropDowns,
        [dropdownId]: true
      }))
    }
  }, [dropdownId, isDropDownActive, setDropDowns])

  if (!m.view) return null

  return subMenuItems.length ? (
    <NavDropdown
      m={m}
      setMobileMenuClosed={setMobileMenuClosed}
      dropDowns={dropDowns}
      isDropDownActive={isDropDownActive}
      toggleSideMenu={toggleSideMenu}
      dropdownId={dropdownId}
      subMenuItems={subMenuItems}
    />
  ) : (
    <NavItemLink m={m} setMobileMenuClosed={setMobileMenuClosed} />
  )
}

export default memo(Nav)
