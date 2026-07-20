import Nav from './Nav'

export default function NavItem({
  sectionId,
  sectionLabel,
  sectionItems,
  setMobileMenuClosed,
  dropDowns,
  setDropDowns,
  toggleSideMenu
}) {
  if (!sectionItems?.length) return null

  return (
    <>
      <li className="side-nav__devider mt-3" aria-hidden="true">
        <span>{sectionLabel}</span>
      </li>

      {sectionItems.map((m, index) => (
        <Nav
          key={`${sectionId}-${m.path || m.label}-${m.id}-${index}`}
          m={m}
          sectionId={sectionId}
          setMobileMenuClosed={setMobileMenuClosed}
          dropDowns={dropDowns}
          setDropDowns={setDropDowns}
          toggleSideMenu={toggleSideMenu}
        />
      ))}
    </>
  )
}
