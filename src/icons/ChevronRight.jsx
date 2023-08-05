export default function ChevronRight({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )
}
