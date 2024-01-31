export default function RegisterBox({ children, className, style }) {
  return (
    <>
      <div className={`${className} register-box p-3 overflow-hidden`} style={style}>
        {children}
      </div>
    </>
  )
}
