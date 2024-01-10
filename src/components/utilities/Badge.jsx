export default function Badge({ name, className, style = null }) {
  return (
    <>
      <span className={`badge rounded-pill ${className}`} style={style}>
        {name}
      </span>
    </>
  )
}
