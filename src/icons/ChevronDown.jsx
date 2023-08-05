export default function ChevronDown({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}
