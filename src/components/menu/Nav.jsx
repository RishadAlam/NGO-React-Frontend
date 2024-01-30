import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavDropdown from './NavDropdown'
import NavItemLink from './NavItemLink'

function Nav({ m, setMobileMenuClosed, dropDowns, setDropDowns, toggleSideMenu, menuKey }) {
  const location = useLocation()
  const isDropDownActive =
    m.subMenu && m.subMenu.map((menu) => menu.path).includes(location.pathname)

  useEffect(() => {
    if (isDropDownActive) {
      setDropDowns({ [`${menuKey}d${m.id}`]: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return m?.subMenu
    ? m.view && (
        <NavDropdown
          m={m}
          setMobileMenuClosed={setMobileMenuClosed}
          dropDowns={dropDowns}
          isDropDownActive={isDropDownActive}
          toggleSideMenu={toggleSideMenu}
          menuKey={menuKey}
        />
      )
    : m.view && <NavItemLink m={m} setMobileMenuClosed={setMobileMenuClosed} />
}

export default memo(Nav)
