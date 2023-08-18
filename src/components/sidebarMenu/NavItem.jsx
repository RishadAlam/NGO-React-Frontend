import Nav from './Nav'

export default function NavItem({ menu, menuKey, location }) {
  return (
    <>
      {menu[menuKey].find((m) => m.view) && (
        <div className="side-nav__devider my-4">
          <span>{menuKey}</span>
        </div>
      )}

      {menu[menuKey].map((m) => (
        <Nav key={`${m.label}${m.id}`} m={m} location={location} />
      ))}
    </>
  )
}
