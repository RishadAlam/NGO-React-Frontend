import Nav from './Nav'

export default function NavItem({ menu, menuKey, location }) {
  return (
    <>
      <div className="side-nav__devider my-2">
        <span>{menuKey}</span>
      </div>

      {menu[menuKey].map((m) => (
        <Nav key={`${m.label}${m.id}`} m={m} location={location} />
      ))}
    </>
  )
}
