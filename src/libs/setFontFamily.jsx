export default function setFontFamily(value) {
  return (
    <span
      ref={(el) => {
        if (el) {
          el.style.setProperty('font-family', 'Poppins', 'important')
        }
      }}>
      {value}
    </span>
  )
}
