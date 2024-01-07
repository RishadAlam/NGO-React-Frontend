export default function RegisterBox({ children, className }) {
  return (
    <>
      <div className={`register-box shadow rounded-4 p-3 overflow-hidden ${className}`}>
        {children}
      </div>
    </>
  )
}
