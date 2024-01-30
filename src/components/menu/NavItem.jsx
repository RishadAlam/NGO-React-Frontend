import Nav from './Nav'

export default function NavItem({
  menu,
  menuKey,
  setMobileMenuClosed,
  dropDowns,
  setDropDowns,
  toggleSideMenu
}) {
  return (
    <>
      {menu[menuKey].find((m) => m.view) && (
        <div className="side-nav__devider mt-3">
          <span>{menuKey}</span>
        </div>
      )}

      {menu[menuKey].map((m) => (
        <Nav
          key={`${m.label}${m.id}`}
          m={m}
          menuKey={menuKey}
          setMobileMenuClosed={setMobileMenuClosed}
          dropDowns={dropDowns}
          setDropDowns={setDropDowns}
          toggleSideMenu={toggleSideMenu}
        />
      ))}
    </>
  )
}
